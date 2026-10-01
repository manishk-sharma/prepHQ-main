# Run Code — Exact Implementation Guide (Docker, No Third-Party Judge)

> Scope: **RUN only.** Submit (hidden testcases, verdict storage, ranking) is a later phase.
> Goal: make our existing Docker runner behave like LeetCode's "Run" button —
> user writes a function, we feed sample testcases as real arguments, and show
> per-testcase **Output vs Expected + Pass/Fail + Runtime**.
> No Judge0 / Piston / any external service. Pure in-house Docker.

---

## 0. What We Already Have

**Backend (existing):**
- Docker-based runner.
- Current API: `{ code, language }` → runs raw code → returns stdout (`{ result: "hello" }`).

**Frontend (existing):**
- `ProblemWorkspace.jsx` → loads problem via `useCodingQuestionBySlug(slug)`.
- `CodeEditorPanel.jsx` → holds `code` + `language` in state.
- `TestcasePanel.jsx` → already has a **"Test Result"** tab waiting for output.
- Problem object already has:
  - `testcases[].inputs` → e.g. `{ "nums": "[2,7,11,15]", "target": "9" }`
  - `testcases[].expected_output` → e.g. `"[0,1]"`
  - `starter_code` → per-language function templates.

**The gap:** current runner only echoes stdout. LeetCode does **function-call execution**:
it calls your function with parsed arguments and checks the **return value**.
That conversion (string inputs → typed arguments → return value → compare) is exactly
what this document specifies.

---

## 1. THE MOST IMPORTANT RULE — Serialization Contract

This single rule makes everything else work. Read it twice.

> **Every value stored in `inputs` and `expected_output` MUST be a valid JSON string.**

| Logical value | How it is stored (string) |
|---------------|---------------------------|
| array `[2,7,11,15]` | `"[2,7,11,15]"` |
| number `9` | `"9"` |
| string `"hello"` | `"\"hello\""`  (note the inner quotes) |
| boolean `true` | `"true"` |
| matrix `[[1,2],[3,4]]` | `"[[1,2],[3,4]]"` |
| null | `"null"` |

Because every stored value is valid JSON, the backend wrapper can do
`JSON.parse(value)` (JS) / `json.loads(value)` (Python) and get a **real typed
argument** — array becomes array, number becomes number, etc.

The **return value** of the user function is serialized back with
`JSON.stringify` / `json.dumps` and compared against `expected_output`
(which is parsed the same way). This gives LeetCode-style type-correct checking.

> Admin upload form must enforce this: each input value and the expected output
> are entered as JSON. `[2,7,11,15]` and `9` are already valid JSON; a plain word
> like `hello` must be entered as `"hello"`.

---

## 2. Argument Order — `entry_point` + ordered params

The function is called with arguments **in a fixed order**. Two new fields are
required on every question so the backend knows *what to call* and *in what order*.

### DB change required on `questions`

```jsonc
{
  "title": "Two Sum",
  "slug": "two-sum",

  "entry_point": "twoSum",          // ← function name backend will call
  "param_order": ["nums", "target"],// ← argument order (maps into inputs)

  "testcases": [
    { "inputs": { "nums": "[2,7,11,15]", "target": "9" }, "expected_output": "[0,1]" }
  ]
}
```

- `entry_point` → the function name the wrapper invokes.
- `param_order` → exact order to pull values out of `inputs` and pass as args.
  (Relying on JS object key order is fragile across languages — store the order explicitly.)

> Admin form action: add two fields — **Entry Point** (text) and **Parameter Order**
> (chips, must match the keys used in testcase inputs).

---

## 3. Frontend → Backend Request (`POST /run`)

```jsonc
POST /run
Content-Type: application/json

{
  "language": "javascript",
  "code": "function twoSum(nums, target) { /* user code */ }",
  "entry_point": "twoSum",
  "param_order": ["nums", "target"],
  "testcases": [
    { "inputs": { "nums": "[2,7,11,15]", "target": "9" }, "expected_output": "[0,1]" },
    { "inputs": { "nums": "[3,2,4]",     "target": "6" }, "expected_output": "[1,2]" }
  ]
}
```

| Field | Frontend source |
|-------|-----------------|
| `language` | `CodeEditorPanel` state |
| `code` | `CodeEditorPanel` state |
| `entry_point` | problem object from `useCodingQuestionBySlug` |
| `param_order` | problem object |
| `testcases` | problem object (only the **visible** sample cases for Run) |

> For **Run**: send only the visible sample testcases.
> For **Submit** (later): backend uses full hidden testcase set; frontend sends none.

---

## 4. Backend Flow (one container per Run, NOT per testcase)

```
POST /run
   │
   1. Validate payload (language supported, code size limit, testcase count limit)
   │
   2. Generate a SINGLE source file:  userCode + auto-generated harness
   │     (harness loops over ALL testcases internally)
   │
   3. Write file to a temp dir  (e.g. /tmp/run-<uuid>/Main.<ext>)
   │
   4. docker run  (locked-down flags) mounting that dir read-only
   │     - one container runs ALL sample testcases in a loop
   │     - prints a single line:  __JUDGE__<json>
   │
   5. Capture stdout + stderr + exit code + wall time
   │
   6. Parse the __JUDGE__ line → per-testcase results
   │     - if no __JUDGE__ line → compile/runtime error (use stderr)
   │     - if container killed by timeout → TLE
   │
   7. Normalize + compare each output vs expected_output
   │
   8. Return structured JSON  (section 7)
```

**Why one container for all testcases:** spawning a Docker container per testcase
is slow (100–400ms startup each). The harness loops internally, so one container
run handles every sample case. This is how it stays snappy.

---

## 5. The Harness (auto-generated wrapper) — per language

The harness is built by the backend at request time: it injects the user code,
parses each testcase's inputs in `param_order`, calls `entry_point`, captures the
return value + per-case runtime + per-case error, and prints one JSON line.

### Output protocol (all languages identical)

The harness prints exactly **one** line to stdout:

```
__JUDGE__[{"output":"...","passed_self":null,"runtime_ms":4,"error":null}, ...]
```

- `output` → `JSON.stringify` of the function's return value (a string).
- `runtime_ms` → per-testcase execution time.
- `error` → runtime error message for that case, or `null`.
- Comparison against `expected_output` is done in **Node**, not in the harness,
  so the harness stays simple and language-agnostic. (Harness only produces outputs.)

> The `__JUDGE__` prefix lets the backend separate judge data from any `console.log`
> the user wrote in their own solution. Backend reads the **last** line starting
> with `__JUDGE__`.

### 5a. JavaScript harness

```javascript
// ===== USER CODE (injected verbatim) =====
function twoSum(nums, target) { /* ... */ }
// ===== END USER CODE =====

// ===== HARNESS (auto-generated) =====
(function () {
  const ENTRY = "twoSum";
  const PARAM_ORDER = ["nums", "target"];
  const RAW_TESTCASES = [
    { "nums": "[2,7,11,15]", "target": "9" },
    { "nums": "[3,2,4]",     "target": "6" }
  ];

  const fn = (typeof twoSum === "function") ? twoSum : null;
  const results = [];

  for (const raw of RAW_TESTCASES) {
    try {
      const args = PARAM_ORDER.map(k => JSON.parse(raw[k]));   // string → typed arg
      const t0 = process.hrtime.bigint();
      const out = fn(...args);
      const t1 = process.hrtime.bigint();
      results.push({
        output: JSON.stringify(out === undefined ? null : out),
        runtime_ms: Number(t1 - t0) / 1e6,
        error: null
      });
    } catch (e) {
      results.push({ output: null, runtime_ms: 0, error: String(e && e.message || e) });
    }
  }
  console.log("__JUDGE__" + JSON.stringify(results));
})();
```

### 5b. Python harness

```python
# ===== USER CODE (injected verbatim) =====
def twoSum(nums, target):
    pass
# ===== END USER CODE =====

# ===== HARNESS (auto-generated) =====
import json, time, traceback

ENTRY = "twoSum"
PARAM_ORDER = ["nums", "target"]
RAW_TESTCASES = [
    {"nums": "[2,7,11,15]", "target": "9"},
    {"nums": "[3,2,4]",     "target": "6"},
]

fn = globals().get(ENTRY)
results = []

for raw in RAW_TESTCASES:
    try:
        args = [json.loads(raw[k]) for k in PARAM_ORDER]   # string -> typed arg
        start = time.perf_counter()
        out = fn(*args)
        ms = (time.perf_counter() - start) * 1000
        results.append({
            "output": json.dumps(out, separators=(",", ":")),
            "runtime_ms": round(ms, 3),
            "error": None
        })
    except Exception as e:
        results.append({"output": None, "runtime_ms": 0, "error": str(e)})

print("__JUDGE__" + json.dumps(results))
```

> If the problem uses a `class Solution` style (Python/Java/C++), the harness
> instantiates it first (e.g. `Solution().twoSum(...)`). Decide ONE convention per
> language and keep starter_code consistent with it. Recommended for Phase 1:
> **top-level function** for JS & Python (simplest), `class Solution` for Java & C++.

### 5c. Java harness (pattern)

Java needs a bundled JSON lib (e.g. **Gson**) in the image to parse arbitrary inputs.
The harness file is `Main.java`:

```java
// Gson available on classpath
import com.google.gson.*;
import java.lang.reflect.*;

public class Main {
  // ===== USER CODE injected as a nested class Solution =====
  static class Solution {
    public int[] twoSum(int[] nums, int target) { /* ... */ return null; }
  }
  // =========================================================

  public static void main(String[] args) {
    Gson gson = new Gson();
    String[][] raw = { {"[2,7,11,15]","9"}, {"[3,2,4]","6"} }; // values per param_order
    JsonArray results = new JsonArray();
    Solution sol = new Solution();

    for (String[] tc : raw) {
      JsonObject r = new JsonObject();
      try {
        int[] nums = gson.fromJson(tc[0], int[].class);
        int target = gson.fromJson(tc[1], int.class);
        long t0 = System.nanoTime();
        int[] out = sol.twoSum(nums, target);
        long t1 = System.nanoTime();
        r.addProperty("output", gson.toJson(out));
        r.addProperty("runtime_ms", (t1 - t0) / 1e6);
        r.add("error", JsonNull.INSTANCE);
      } catch (Exception e) {
        r.add("output", JsonNull.INSTANCE);
        r.addProperty("runtime_ms", 0);
        r.addProperty("error", e.toString());
      }
      results.add(r);
    }
    System.out.println("__JUDGE__" + results.toString());
  }
}
```

> Java/C++ can't introspect arbitrary signatures the way JS/Python can. For these,
> the per-type argument parsing (`int[]`, `int`, `String`, etc.) must be generated
> from a **type signature** stored on the problem (a Phase-2 enhancement).
> **Phase 1 recommendation: ship JavaScript + Python first**, add Java/C++ after.

### 5d. C++ harness (pattern)

Use **nlohmann/json** (header-only) bundled in the image. Same shape as Java:
parse each input with `json::parse`, cast to the declared type, call the method,
`dump()` the result, print `__JUDGE__` + JSON array.

---

## 6. Docker Execution — exact command & lockdown

### One image, all languages

Build a single image with `node`, `python3`, `openjdk`, `g++` + JSON libs preinstalled.
Keeps things simple; pick interpreter by `language`.

```dockerfile
# Dockerfile.runner
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y --no-install-recommends \
    nodejs python3 default-jdk g++ \
    && rm -rf /var/lib/apt/lists/*

# Gson for Java, nlohmann/json for C++ (place where compiler finds them)
# COPY libs/gson.jar /opt/gson.jar
# COPY libs/json.hpp /usr/include/nlohmann/json.hpp

# Non-root user — code NEVER runs as root
RUN useradd -m -u 1001 runner
USER runner
WORKDIR /app
```

Build once: `docker build -t prephq-runner -f Dockerfile.runner .`

### Exact `docker run` flags (security-critical)

```bash
docker run \
  --rm \                          # auto-remove container after exit
  --network none \                # NO internet access
  --memory=256m \                 # hard memory cap
  --memory-swap=256m \            # disable swap (else memory cap is bypassable)
  --cpus=0.5 \                    # CPU cap
  --pids-limit=64 \               # stop fork bombs
  --read-only \                   # root FS read-only
  --tmpfs /tmp:rw,size=16m \      # only /tmp writable, capped
  --user 1001 \                   # non-root
  --cap-drop ALL \                # drop all Linux capabilities
  --security-opt no-new-privileges \
  -v /tmp/run-<uuid>:/code:ro \   # mount generated source read-only
  prephq-runner \
  <runCommand>
```

`<runCommand>` per language:

| Language | Command |
|----------|---------|
| JavaScript | `node /code/Main.js` |
| Python | `python3 /code/Main.py` |
| Java | `bash -c "javac -cp /opt/gson.jar /code/Main.java -d /tmp && java -cp /tmp:/opt/gson.jar Main"` |
| C++ | `bash -c "g++ /code/Main.cpp -o /tmp/sol -std=c++17 && /tmp/sol"` |

### Timeout (TLE) — wall-clock kill

Don't rely on in-container timing alone. Wrap the `docker run` in a host-side
timeout. If it overruns, kill the container and report TLE.

```js
// Node, using child_process.spawn
const { spawn } = require("child_process");
const TIMEOUT_MS = 5000;

function runContainer(args) {
  return new Promise((resolve) => {
    const proc = spawn("docker", ["run", ...args]);
    let stdout = "", stderr = "";
    let killed = false;

    const timer = setTimeout(() => {
      killed = true;
      proc.kill("SIGKILL");           // kills the docker client; --rm cleans the container
    }, TIMEOUT_MS);

    proc.stdout.on("data", d => { stdout += d; });
    proc.stderr.on("data", d => { stderr += d; });
    proc.on("close", (exitCode) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, exitCode, timedOut: killed });
    });
  });
}
```

---

## 7. Backend `/run` Handler — exact logic (Node/Express)

```js
// routes/run.js
const express = require("express");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const router = express.Router();

const LANG_CONFIG = {
  javascript: { ext: "js",   file: "Main.js",   cmd: d => ["node", `${d}/Main.js`] },
  python:     { ext: "py",   file: "Main.py",   cmd: d => ["python3", `${d}/Main.py`] },
  // java, cpp added later
};

const TIMEOUT_MS = 5000;
const MAX_CODE_BYTES = 64 * 1024;     // 64 KB
const MAX_TESTCASES  = 25;

router.post("/run", async (req, res) => {
  const { language, code, entry_point, param_order, testcases } = req.body;

  // 1. validate
  const cfg = LANG_CONFIG[language];
  if (!cfg) return res.json({ status: "error", message: "Unsupported language" });
  if (!code || Buffer.byteLength(code) > MAX_CODE_BYTES)
    return res.json({ status: "error", message: "Code missing or too large" });
  if (!Array.isArray(testcases) || testcases.length === 0 || testcases.length > MAX_TESTCASES)
    return res.json({ status: "error", message: "Invalid testcases" });

  // 2. build harness source (string inputs only — values stay as stored JSON strings)
  const rawInputs = testcases.map(tc => tc.inputs);
  const source = buildHarness(language, code, entry_point, param_order, rawInputs);

  // 3. temp dir
  const dir = path.join(os.tmpdir(), `run-${crypto.randomUUID()}`);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, cfg.file), source);

  try {
    // 4. docker run (locked-down flags from section 6)
    const dockerArgs = [
      "run", "--rm", "--network", "none",
      "--memory=256m", "--memory-swap=256m", "--cpus=0.5",
      "--pids-limit=64", "--read-only", "--tmpfs", "/tmp:rw,size=16m",
      "--user", "1001", "--cap-drop", "ALL",
      "--security-opt", "no-new-privileges",
      "-v", `${dir}:/code:ro`,
      "prephq-runner",
      ...cfg.cmd("/code"),
    ];
    const { stdout, stderr, timedOut } = await runContainer(dockerArgs);

    // 5. timeout?
    if (timedOut)
      return res.json({ status: "timeout", message: `Time Limit Exceeded (${TIMEOUT_MS}ms)`, results: [] });

    // 6. find __JUDGE__ line
    const line = stdout.split("\n").reverse().find(l => l.startsWith("__JUDGE__"));
    if (!line) {
      // no judge output → compile/runtime error before any case ran
      return res.json({
        status: "runtime_error",
        error_message: (stderr || "Execution failed").slice(0, 2000),
        results: [],
      });
    }

    const harnessResults = JSON.parse(line.slice("__JUDGE__".length));

    // 7. compare each output vs expected_output (normalized)
    let passedCount = 0;
    const results = harnessResults.map((r, i) => {
      const expected = testcases[i].expected_output;
      const passed = r.error == null && normalizedEqual(r.output, expected);
      if (passed) passedCount++;
      return {
        case: i + 1,
        input: testcases[i].inputs,
        your_output: r.error ? null : r.output,
        expected_output: expected,
        passed,
        runtime_ms: r.runtime_ms,
        error: r.error || null,
      };
    });

    // 8. respond
    const allPassed = passedCount === results.length && results.every(r => !r.error);
    return res.json({
      status: "success",
      results,
      summary: {
        passed: passedCount,
        total: results.length,
        status: allPassed ? "Accepted" : (results.some(r => r.error) ? "Runtime Error" : "Wrong Answer"),
        avg_runtime_ms: avg(results.map(r => r.runtime_ms)),
      },
    });
  } finally {
    // always clean temp dir
    fs.rm(dir, { recursive: true, force: true }).catch(() => {});
  }
});

// normalize so [0,1] === [0, 1] and 9 === 9.0 etc.
function normalizedEqual(a, b) {
  try { return JSON.stringify(JSON.parse(a)) === JSON.stringify(JSON.parse(b)); }
  catch { return String(a).trim() === String(b).trim(); }
}
function avg(arr) { return arr.length ? +(arr.reduce((s, n) => s + n, 0) / arr.length).toFixed(3) : 0; }

module.exports = router;
```

`buildHarness(...)` simply string-templates the per-language harness from section 5,
injecting `code`, `entry_point`, `param_order`, and the raw input objects
(as JSON — values remain strings, parsed inside the harness).

---

## 8. Backend → Frontend Response (contract)

### All passed
```jsonc
{
  "status": "success",
  "results": [
    { "case": 1, "input": {"nums":"[2,7,11,15]","target":"9"},
      "your_output": "[0,1]", "expected_output": "[0,1]",
      "passed": true, "runtime_ms": 4, "error": null }
  ],
  "summary": { "passed": 1, "total": 1, "status": "Accepted", "avg_runtime_ms": 4 }
}
```

### Wrong answer
```jsonc
{
  "status": "success",
  "results": [
    { "case": 1, "input": {...},
      "your_output": "[1,0]", "expected_output": "[0,1]",
      "passed": false, "runtime_ms": 3, "error": null }
  ],
  "summary": { "passed": 0, "total": 1, "status": "Wrong Answer", "avg_runtime_ms": 3 }
}
```

### Runtime error (one case)
```jsonc
{
  "status": "success",
  "results": [
    { "case": 1, "input": {...}, "your_output": null, "expected_output": "[0,1]",
      "passed": false, "runtime_ms": 0,
      "error": "TypeError: Cannot read properties of undefined (reading '0')" }
  ],
  "summary": { "passed": 0, "total": 1, "status": "Runtime Error", "avg_runtime_ms": 0 }
}
```

### Compile error / nothing ran
```jsonc
{ "status": "runtime_error", "error_message": "SyntaxError: Unexpected token ...", "results": [] }
```

### Timeout
```jsonc
{ "status": "timeout", "message": "Time Limit Exceeded (5000ms)", "results": [] }
```

---

## 9. Frontend Wiring (later — for reference, no change yet)

1. **Service** (`codingQuestionsServices.js`): add
   ```js
   const runCode = (payload) => api.post("/run", payload).then(r => r.data);
   export const useRunCode = () => useMutation({ mutationFn: runCode });
   ```
2. **WorkspaceHeader** "Run" button → calls `onRun`.
3. **ProblemWorkspace** owns `runResult` state; builds payload from
   `code` + `language` (lifted from `CodeEditorPanel`) + `entry_point` +
   `param_order` + visible `testcases`; calls `useRunCode`.
4. **TestcasePanel** "Test Result" tab → renders `results[]`:
   per-case Pass/Fail badge, Your Output, Expected, runtime; overall `summary.status`
   banner (Accepted green / Wrong Answer red / Runtime Error red / TLE yellow).

> Note: `CodeEditorPanel` currently keeps `code`/`language` internal. To send them
> on Run, lift that state up to `ProblemWorkspace` (or expose via callback). This is
> the only frontend refactor needed — do it when we start the wiring phase.

---

## 10. Phase Plan

1. **Phase 1 (now):** JS + Python. Function-call harness, Docker lockdown, `/run` returns
   per-case Output/Expected/Pass/Runtime. Sample testcases only.
2. **Phase 2:** Java + C++ (needs per-type signature stored on the problem).
3. **Phase 3 (Submit):** hidden testcases stored server-side, full-set run, verdict
   persisted, only pass/fail counts returned (never reveal hidden inputs).

---

## 11. Hard Checklist for Backend Dev

- [ ] Add `entry_point` + `param_order` columns to `questions` + admin form fields.
- [ ] Enforce JSON-string contract for all `inputs` values + `expected_output`.
- [ ] Build single `prephq-runner` Docker image (node + python first).
- [ ] Implement `buildHarness()` for JS + Python (section 5).
- [ ] `/run` handler: generate file → docker run (locked flags) → parse `__JUDGE__` → compare → respond.
- [ ] Host-side 5s timeout that SIGKILLs the container → TLE.
- [ ] `--network none`, `--memory`, `--pids-limit`, `--read-only`, non-root, `--cap-drop ALL`.
- [ ] Always delete temp dir in `finally`.
- [ ] Limits: code size (64KB), testcase count (25), output size cap.
- [ ] Normalize comparison (`[0,1]` == `[0, 1]`).
- [ ] Return exact response contract (section 8) so frontend can render without guesswork.
```
