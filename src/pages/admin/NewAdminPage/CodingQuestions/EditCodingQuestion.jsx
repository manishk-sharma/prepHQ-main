import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";

import { CodingQuestionSchema } from "../schema/codingQuestionSchema";
import CodingQuestionForm from "../components/coding-question-form/CodingQuestionForm";
import {
  useCodingQuestionBySlug,
  useUpdateCodingQuestion,
} from "../../../../services/codingQuestionsServices";
import { useNotification } from "../../../../context/useNotificationContext";

const DEFAULT_STARTER_CODE = {
  javascript:
    "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar solution = function(nums, target) {\n    \n};",
  python:
    "class Solution:\n    def solution(self, nums, target):\n        pass",
  java: "class Solution {\n    public int[] solution(int[] nums, int target) {\n        \n    }\n}",
  cpp: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> solution(vector<int>& nums, int target) {\n        \n    }\n};",
};

const EditCodingQuestion = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const { mutateAsync: updateCodingQuestion, isPending } =
    useUpdateCodingQuestion();
  const {
    data: questionData,
    isLoading,
    isError,
  } = useCodingQuestionBySlug(slug);

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

  // Populate form once API data arrives
  useEffect(() => {
    if (!questionData) return;

    console.log("EditCodingQuestion — loaded question data:", questionData);

    reset({
      title: questionData.title || "",
      slug: questionData.slug || "",
      difficulty: questionData.difficulty || "",
      domain: questionData.domain || "",
      topics: questionData.topics || [],
      description: questionData.description || "",

      examples: questionData.examples?.length
        ? questionData.examples.map((ex) => ({
            input: ex.input || "",
            output: ex.output || "",
            explanation: ex.explanation || "",
          }))
        : [{ input: "", output: "", explanation: "" }],

      // API sends constraints_list as string[], form needs [{ value }]
      constraints: questionData.constraints_list?.length
        ? questionData.constraints_list.map((v) => ({ value: v }))
        : [{ value: "" }],

      // API key is starter_code, form key is starterCode
      starterCode: questionData.starter_code
        ? { ...DEFAULT_STARTER_CODE, ...questionData.starter_code }
        : DEFAULT_STARTER_CODE,

      entry_point: questionData.entry_point || "",
      param_order: questionData.param_order || [],

      // API testcases: [{ inputs: {key: val}, expected_output }]
      // Form testcases: [{ params: [{ key, value }], expected_output }]
      testcases: questionData.testcases?.length
        ? questionData.testcases.map((tc) => ({
            params: Object.entries(tc.inputs || {}).map(([key, value]) => ({
              key,
              value: String(value),
            })),
            // expected_output: tc.expected_output || "",
            expected_output:
              tc.expected_output !== undefined && tc.expected_output !== null
                ? JSON.stringify(tc.expected_output)
                : "",
          }))
        : [{ params: [{ key: "", value: "" }], expected_output: "" }],
    });
  }, [questionData, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      title: data.title.trim(),
      slug: data.slug.trim(),
      difficulty: data.difficulty,
      domain: data.domain,
      topics: data.topics,
      description: data.description.trim(),
      examples: data.examples.map((ex) => ({
        input: ex.input.trim(),
        output: ex.output.trim(),
        explanation: (ex.explanation || "").trim(),
      })),
      constraints_list: data.constraints.map((c) => c.value.trim()),
      starter_code: data.starterCode,
      entry_point: data.entry_point.trim(),
      param_order: data.param_order.map((p) => p.trim()),
      testcases: data.testcases.map((tc) => ({
        inputs: Object.fromEntries(
          tc.params.map((p) => [p.key.trim(), p.value.trim()]),
        ),
        expected_output: tc.expected_output.trim(),
      })),
    };

    const id = questionData?.id;
    console.log("EditCodingQuestion — update id:", id);
    console.log(
      "EditCodingQuestion — update payload:",
      JSON.stringify(payload, null, 2),
    );

    try {
      await updateCodingQuestion({ id, data: payload });
      navigate("/admin/coding-questions/list");
    } catch (error) {
      // error notification handled by useUpdateCodingQuestion's onError
    }
  });

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: 300 }}
      >
        <CircularProgress sx={{ color: "#074568" }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-danger text-center mt-5">
        Failed to load question data. Please try again.
      </div>
    );
  }

  return (
    <CodingQuestionForm
      pageTitle="Edit Coding Question"
      submitLabel="Update Question"
      isLoading={isPending}
      onSubmit={onSubmit}
      formMethods={{ register, control, setValue, watch, getValues, errors }}
    />
  );
};

export default EditCodingQuestion;
