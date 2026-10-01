
import * as yup from "yup";
export const PostSchema = yup.object({
  post_title: yup.string().required("Post title is required"),
  post_name: yup.string().required("Post slug is required"),

  category_name: yup.string().required("Category name required"),
  category_slug: yup.string().required("Category slug required"),

  post_content: yup
    .string()
    .test(
      "not-empty",
      "Content is required",
      (value) => !!value && value.replace(/<(.|\n)*?>/g, "").trim().length > 0,
    ),

  seo_title: yup.string().nullable().max(60).required("Title is required"),
  seo_desc: yup.string().nullable().max(160).required("Seo Desc is required"),
  seo_focus_keyword: yup.string().nullable().required("Keyword is required"),

  seo_tags: yup
    .array()
    .of(yup.string())
    .required("At least one tag is required"),

  author_id: yup.number().required("Author is required"),

  feature_image: yup.mixed().required("Feature image is required"),
});

export const EditSchema = yup.object({
  post_title: yup.string().required("Post title is required"),
  post_name: yup.string().required("Post slug is required"),

  category_name: yup.string().required("Category name required"),
  category_slug: yup.string().required("Category slug required"),

  post_content: yup
    .string()
    .test(
      "not-empty",
      "Content is required",
      (value) => !!value && value.replace(/<(.|\n)*?>/g, "").trim().length > 0,
    ),

  seo_title: yup.string().required("Title is required"),
  seo_desc: yup.string().required("Seo Desc is required"),
  seo_focus_keyword: yup.string().required("Keyword is required"),

  seo_tags: yup.array().of(yup.string()).min(1, "At least one tag required"),

  author_id: yup.number().required("Author is required"),

  feature_image: yup.mixed().nullable(), // optional only here
});
