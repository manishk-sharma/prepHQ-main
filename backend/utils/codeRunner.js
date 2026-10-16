import vm from 'node:vm';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const parseJsonValue = (val) => {
  if (val === null || val === undefined) return null;
  if (typeof val !== 'string') return val;
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
};

const normalizedEqual = (a, b) => {
  if (a === b) return true;
  try {
    const parsedA = typeof a === 'string' ? JSON.parse(a) : a;
    const parsedB = typeof b === 'string' ? JSON.parse(b) : b;
    return JSON.stringify(parsedA) === JSON.stringify(parsedB);
  } catch {
    return String(a).trim() === String(b).trim();
  }
};

/**
 * Execute JavaScript solution in a secure VM sandbox with timeout
 */
const runJavaScript = async ({ code, entry_point = 'solution', param_order = [], testcases = [] }) => {
  const results = [];
  const startTotal = Date.now();

  const fnName = entry_point || 'solution';

  for (let i = 0; i < testcases.length; i++) {
    const tc = testcases[i];
    const inputsMap = tc.inputs || {};
    const expected = tc.expected_output;

    const orderedArgs = (param_order && param_order.length > 0)
      ? param_order.map((key) => parseJsonValue(inputsMap[key]))
      : Object.values(inputsMap).map(parseJsonValue);

    const sandbox = {
      console: { log: () => {} },
      Map,
      Set,
      Math,
      Array,
      Object,
      String,
      Number,
      Boolean,
      JSON,
      Date,
      RegExp,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      __args: orderedArgs,
      __result: null,
      __error: null,
    };

    const scriptSource = `
      "use strict";
      ${code}
      try {
        let fn = typeof ${fnName} === 'function' ? ${fnName} : (typeof solution === 'function' ? solution : null);
        if (!fn && typeof Solution === 'function') {
          const inst = new Solution();
          fn = typeof inst.${fnName} === 'function' ? inst.${fnName}.bind(inst) : null;
        }
        if (!fn) throw new Error("Entry point function '${fnName}' not found.");
        __result = fn(...__args);
      } catch (err) {
        __error = err ? (err.message || String(err)) : "Runtime error";
      }
    `;

    const startCase = Date.now();
    try {
      const context = vm.createContext(sandbox);
      const script = new vm.Script(scriptSource);
      script.runInContext(context, { timeout: 2000 });

      const runtime_ms = Math.max(1, Date.now() - startCase);
      const error = sandbox.__error;
      const actual = sandbox.__result;
      const passed = !error && normalizedEqual(actual, expected);

      results.push({
        testcase_index: i,
        passed,
        inputs: inputsMap,
        expected_output: expected,
        actual_output: error ? null : JSON.stringify(actual),
        runtime_ms,
        error: error || null,
      });
    } catch (err) {
      const runtime_ms = Math.max(1, Date.now() - startCase);
      results.push({
        testcase_index: i,
        passed: false,
        inputs: inputsMap,
        expected_output: expected,
        actual_output: null,
        runtime_ms,
        error: err.message || 'Execution error or timeout',
      });
    }
  }

  const passedCount = results.filter((r) => r.passed).length;
  return {
    status: 'success',
    results,
    summary: {
      total: testcases.length,
      passed: passedCount,
      failed: testcases.length - passedCount,
      total_runtime_ms: Date.now() - startTotal,
    },
  };
};

/**
 * Execute Python solution via Python child process
 */
const runPython = async ({ code, entry_point = 'solution', param_order = [], testcases = [] }) => {
  const fnName = entry_point || 'solution';
  const tmpDir = os.tmpdir();
  const scriptPath = path.join(tmpDir, `prephq_run_${Date.now()}_${Math.random().toString(36).substr(2, 6)}.py`);

  const pythonHarness = `
import json
import sys
import time

${code}

testcases = ${JSON.stringify(testcases)}
param_order = ${JSON.stringify(param_order)}
entry_point_name = "${fnName}"

results = []
for idx, tc in enumerate(testcases):
    inputs_map = tc.get("inputs", {})
    expected = tc.get("expected_output")
    
    if param_order and len(param_order) > 0:
        args = [json.loads(inputs_map[k]) if isinstance(inputs_map.get(k), str) else inputs_map.get(k) for k in param_order if k in inputs_map]
    else:
        args = [json.loads(v) if isinstance(v, str) else v for v in inputs_map.values()]
        
    start_t = time.time()
    try:
        if 'Solution' in globals():
            sol = Solution()
            fn = getattr(sol, entry_point_name, None) or getattr(sol, 'solution', None)
        else:
            fn = globals().get(entry_point_name) or globals().get('solution')
            
        if not fn:
            raise Exception(f"Function {entry_point_name} not found")
            
        res = fn(*args)
        runtime_ms = max(1, int((time.time() - start_t) * 1000))
        actual_str = json.dumps(res)
        
        # compare
        try:
            exp_obj = json.loads(expected) if isinstance(expected, str) else expected
            passed = (res == exp_obj)
        except Exception:
            passed = (str(res).strip() == str(expected).strip())
            
        results.append({
            "testcase_index": idx,
            "passed": passed,
            "inputs": inputs_map,
            "expected_output": expected,
            "actual_output": actual_str,
            "runtime_ms": runtime_ms,
            "error": None
        })
    except Exception as e:
        runtime_ms = max(1, int((time.time() - start_t) * 1000))
        results.append({
            "testcase_index": idx,
            "passed": False,
            "inputs": inputs_map,
            "expected_output": expected,
            "actual_output": None,
            "runtime_ms": runtime_ms,
            "error": str(e)
        })

print("__OUTPUT__" + json.dumps(results))
`;

  fs.writeFileSync(scriptPath, pythonHarness, 'utf-8');

  return new Promise((resolve) => {
    execFile('python', [scriptPath], { timeout: 4000 }, (err, stdout, stderr) => {
      try {
        fs.unlinkSync(scriptPath);
      } catch {}

      if (err && !stdout) {
        return resolve({
          status: 'runtime_error',
          error: stderr || err.message || 'Python execution failed',
          results: [],
          summary: { total: testcases.length, passed: 0, failed: testcases.length, total_runtime_ms: 0 },
        });
      }

      try {
        const outIdx = stdout.indexOf('__OUTPUT__');
        if (outIdx !== -1) {
          const jsonStr = stdout.slice(outIdx + '__OUTPUT__'.length).trim();
          const results = JSON.parse(jsonStr);
          const passedCount = results.filter((r) => r.passed).length;
          return resolve({
            status: 'success',
            results,
            summary: {
              total: testcases.length,
              passed: passedCount,
              failed: testcases.length - passedCount,
              total_runtime_ms: results.reduce((acc, r) => acc + (r.runtime_ms || 1), 0),
            },
          });
        }
      } catch (parseErr) {
        // Fallback
      }

      resolve({
        status: 'error',
        error: stderr || stdout || 'Failed to parse execution output',
        results: [],
        summary: { total: testcases.length, passed: 0, failed: testcases.length, total_runtime_ms: 0 },
      });
    });
  });
};

/**
 * Main code runner entry point
 */
export const executeCode = async ({ language = 'javascript', code = '', entry_point = 'solution', param_order = [], testcases = [] }) => {
  const lang = (language || 'javascript').toLowerCase();

  if (lang.includes('python')) {
    return runPython({ code, entry_point, param_order, testcases });
  }

  // Default to JavaScript
  return runJavaScript({ code, entry_point, param_order, testcases });
};

export default { executeCode };
