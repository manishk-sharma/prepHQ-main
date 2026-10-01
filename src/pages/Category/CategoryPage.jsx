import { useNavigate, useParams } from "react-router-dom";
import {
  useInterviewByCategory,
  useInterviewList,
} from "../../services/interviewsServices";
import {
  useProjectByCategory,
  useProjectList,
} from "../../services/projectsServices";
import {
  useTutorialList,
  useTutorialByCategory,
} from "../../services/tutorialServices";

import { useBlogList, useBlogByCategory } from "../../services/blogServices";
import { useEffect, useState } from "react";
import PageBreadcrumbs from "../../components/PageBreadcrumbs";
import PostCard from "../../components/PostCard";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { groupByCategoryWithCount } from "../../utils/helper";
import SearchWithDebounce from "../../components/SearchWithDebounce";

const GREEN = "#58C99A";
const PAGE_SIZE = 6;

const CategoryPage = () => {
  const { type, slug } = useParams();
  
  useEffect(()=>{
    console.log(`type: ${type} & Slug: ${slug}`);
  },[type, slug])

  const { data: interviewData } = useInterviewList({
    enabled: type === "interviews",
  });

  const { data: projectData } = useProjectList({
    enabled: type === "projects",
  });

  const { data: interviewCategoryData } = useInterviewByCategory(
    type === "interviews" ? slug : null,
  );

  const { data: projectCategoryData } = useProjectByCategory(
    type === "projects" ? slug : null,
  );
  const { data: tutorialData } = useTutorialList({
    enabled: type === "tutorials",
  });

  const { data: blogData } = useBlogList({
    enabled: type === "blogs",
  });

  const { data: tutorialCategoryData } = useTutorialByCategory(
    type === "tutorials" ? slug : null,
  );

  const { data: blogCategoryData } = useBlogByCategory(
    type === "blogs" ? slug : null,
  );
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const categories =
    type === "interviews"
      ? groupByCategoryWithCount(interviewData)
      : type === "projects"
        ? groupByCategoryWithCount(projectData)
        : type === "tutorials"
          ? groupByCategoryWithCount(tutorialData)
          : type === "blogs"
            ? groupByCategoryWithCount(blogData)
            : [];

  const categoryList =
    type === "interviews"
      ? interviewCategoryData
      : type === "projects"
        ? projectCategoryData
        : type === "tutorials"
          ? tutorialCategoryData
          : type === "blogs"
            ? blogCategoryData
            : [];
            
  const handleGetInterviewByCategory = (categorySlug) => {
    navigate(`/${type}/category/${categorySlug}`);
  };

  useEffect(() => {
    setPage(1);
    setSearch("");
  }, [slug]);

  // Search filter
  const searchedList = (categoryList || []).filter((item) => {
    const q = search.toLowerCase();
    return (
      item?.post_title?.toLowerCase().includes(q) ||
      item?.excerpt?.toLowerCase().includes(q)
    );
  });

  // Pagination
  const totalPages = Math.ceil((searchedList?.length || 0) / PAGE_SIZE);
  const paginatedList = searchedList?.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [page, search, type, slug]);
  return (
    <>
      <PageBreadcrumbs title={`Category-Page - ${slug} - ${type}`} />
      <section className="tutorials-page py-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="posts-grid">
                {paginatedList?.map((item) => (
                  <PostCard key={item?.ID} cardData={item} type={type} />
                ))}
              </div>

              <div className="d-flex justify-content-center mt-4 mt-lg-5">
                <Pagination
                  count={Math.max(totalPages, 1)}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  renderItem={(item) => (
                    <PaginationItem
                      {...item}
                      slots={{
                        previous: () => <span>&laquo;</span>,
                        next: () => <span>&raquo;</span>,
                      }}
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        fontWeight: 600,

                        border: "1px solid #dcdcdc",
                        color: "#222",

                        "&.Mui-selected": {
                          backgroundColor: GREEN,
                          color: "#fff",
                          border: `1px solid ${GREEN}`,
                        },

                        "&.Mui-selected:hover": {
                          backgroundColor: GREEN,
                        },

                        "&.MuiPaginationItem-previousNext": {
                          border: `1px solid ${GREEN}`,
                          color: GREEN,
                          fontSize: "20px",
                        },

                        "&.MuiPaginationItem-previousNext:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    />
                  )}
                />
              </div>
            </div>

            <div className="col-lg-4">
              <div className="sticky-div">
                <SearchWithDebounce
                  key={slug} // slug change hone par search input reset ho
                  className="mb-4"
                  onSearch={(query) => {
                    setSearch((prev) => {
                      if (prev === query) return prev;
                      setPage(1); // search change hone par page 1 pe jao
                      return query;
                    });
                  }}
                />

                <h4 className="text-muted mb-3">Popular Category</h4>
                <ul className="categories-list unstyled rounded-3 p-3 p-lg-4 d-flex flex-column gap-2 gap-lg-3">
                  {categories?.map((item) => (
                    <li
                      onClick={() =>
                        handleGetInterviewByCategory(item?.category_slug)
                      }
                      key={item?.category_slug}
                      className="d-flex align-items-center justify-content-between rounded-3"
                      style={{
                        cursor: "pointer",
                        fontWeight: item?.category_slug === slug ? 700 : 400,
                        color: item?.category_slug === slug ? GREEN : "inherit",
                      }}
                    >
                      <span>{item?.category_name}</span>
                      <span>({item?.count})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CategoryPage;
