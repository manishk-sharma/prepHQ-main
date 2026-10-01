import { useInterview } from "../services/interviewsServices";
import { useProject } from "../services/projectsServices";
import { useTutorial } from "../services/tutorialServices";
import { useBlog } from "../services/blogServices";


export const usePostDetail = (type, id) => {

  const interview = useInterview(
    type === "interviews" ? id : null
  );

  const project = useProject(
    type === "projects" ? id : null
  );

  const tutorial = useTutorial(
    type === "tutorials" ? id : null
  );

  const blog = useBlog(
    type === "blogs" ? id : null
  );

  if (type === "interviews") return interview;
  if (type === "projects")  return project;
  if (type === "tutorials") return tutorial;
  if (type === "blogs") return blog;

  return { data: null, isLoading: false };
};