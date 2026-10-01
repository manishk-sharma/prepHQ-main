import * as yup from "yup";

export const CodingQuestionSchema = yup.object({
  title: yup.string().required("Title is required"),
  slug: yup.string().required("Slug is required"),
  difficulty: yup
    .string()
    .oneOf(["Easy", "Medium", "Hard"], "Select Easy, Medium, or Hard")
    .required("Difficulty is required"),
  domain: yup.string().required("Domain is required"),
  topics: yup
    .array()
    .of(yup.string())
    .min(1, "At least one topic is required"),
  description: yup.string().required("Description is required"),
  examples: yup
    .array()
    .of(
      yup.object({
        input: yup.string().required("Input is required"),
        output: yup.string().required("Output is required"),
        explanation: yup.string(),
      })
    )
    .min(1, "At least one example is required"),
  constraints: yup
    .array()
    .of(
      yup.object({
        value: yup.string().required("Constraint cannot be empty"),
      })
    )
    .min(1, "At least one constraint is required"),
  starterCode: yup.object({
    javascript: yup.string().default(""),
    python: yup.string().default(""),
    java: yup.string().default(""),
    cpp: yup.string().default(""),
  }),
  entry_point: yup
    .string()
    .required("Entry point (function name) is required"),
  param_order: yup
    .array()
    .of(yup.string())
    .min(1, "At least one parameter is required"),
  testcases: yup
    .array()
    .of(
      yup.object({
        params: yup
          .array()
          .of(
            yup.object({
              key: yup.string().required("Parameter name is required"),
              value: yup.string().required("Parameter value is required"),
            })
          )
          .min(1, "At least one parameter is required"),
        expected_output: yup.string().required("Expected output is required"),
      })
    )
    .min(1, "At least one testcase is required"),
});
