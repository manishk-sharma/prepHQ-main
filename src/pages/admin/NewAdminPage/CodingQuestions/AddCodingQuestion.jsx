import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

import { CodingQuestionSchema } from "../schema/codingQuestionSchema";
import CodingQuestionForm from "../components/coding-question-form/CodingQuestionForm";
import { useAddCodingQuestion } from "../../../../services/codingQuestionsServices";
import { useCodingQuestionDraft } from "../../../../hooks/useCodingQuestionDraft";

const CQ_DRAFTS_KEY = "coding_question_drafts";

/* ── Default starter code templates ──────────────────────────────────────── */
const DEFAULT_STARTER_CODE = {
  javascript:
    "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar solution = function(nums, target) {\n    \n};",
  python:
    "class Solution:\n    def solution(self, nums, target):\n        pass",
  java:
    "class Solution {\n    public int[] solution(int[] nums, int target) {\n        \n    }\n}",
  cpp:
    "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> solution(vector<int>& nums, int target) {\n        \n    }\n};",
};

const AddCodingQuestion = () => {
  const navigate = useNavigate();
  const { mutateAsync: addCodingQuestion, isPending } = useAddCodingQuestion();
  const [previewOpen, setPreviewOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CodingQuestionSchema),
    defaultValues: {
      title: "",
      slug: "",
      difficulty: "",
      domain: "",
      topics: [],
      description: "",
      examples: [{ input: "", output: "", explanation: "" }],
      constraints: [{ value: "" }],
      starterCode: DEFAULT_STARTER_CODE,
      entry_point: "",
      param_order: [],
      testcases: [{ params: [{ key: "", value: "" }], expected_output: "" }],
    },
  });

  const draft = useCodingQuestionDraft(CQ_DRAFTS_KEY, {
    getFormValues: getValues,
    resetForm: reset,
  });

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      title:       data.title.trim(),
      slug:        data.slug.trim(),
      difficulty:  data.difficulty,
      domain:      data.domain,
      topics:      data.topics,
      description: data.description.trim(),
      examples:    data.examples.map((ex) => ({
        input:       ex.input.trim(),
        output:      ex.output.trim(),
        explanation: (ex.explanation || "").trim(),
      })),
      constraints_list: data.constraints.map((c) => c.value.trim()),
      starter_code:     data.starterCode,
      entry_point:      data.entry_point.trim(),
      param_order:      data.param_order.map((p) => p.trim()),
      status:           "active",
      testcases:   data.testcases.map((tc) => ({
        inputs: Object.fromEntries(
          tc.params.map((p) => [p.key.trim(), p.value.trim()])
        ),
        expected_output: tc.expected_output.trim(),
      })),
    };

    console.group("%c[ADD QUESTION] Payload sent to backend", "color:#22c55e;font-weight:bold;font-size:13px");
    console.log("entry_point  :", payload.entry_point);
    console.log("param_order  :", payload.param_order);
    console.log("testcases    :", payload.testcases);
    console.log("Full JSON    :\n" + JSON.stringify(payload, null, 2));
    console.groupEnd();

    try {
      await addCodingQuestion(payload);
      draft.clearCurrentDraft();
      reset();
      navigate("/admin/coding-questions/list");
    } catch (error) {
      // error notification handled by useAddCodingQuestion's onError
    }
  });

  return (
    <CodingQuestionForm
      pageTitle="Add Coding Question"
      submitLabel="Save Question"
      isLoading={isPending}
      onSubmit={onSubmit}
      formMethods={{ register, control, setValue, watch, getValues, errors }}
      draft={draft}
      previewOpen={previewOpen}
      setPreviewOpen={setPreviewOpen}
    />
  );
};

export default AddCodingQuestion;
