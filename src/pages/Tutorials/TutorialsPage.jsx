import React, { useEffect, useState } from "react";
import PostCard from "../../components/PostCard";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import SearchWithDebounce from "../../components/SearchWithDebounce";

import {
  useTutorialByCategory,
  useTutorialList,
} from "../../services/tutorialServices";

import { groupByCategoryWithCount } from "../../utils/helper";
import PageBreadcrumbs from "../../components/PageBreadcrumbs";
import PostListSkeleton from "../../skeletons/PostListSkeleton";

const GREEN = "#58C99A";

const TutorialsPage = () => {

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [search, setSearch] = useState("");

  const { data: tutorialData, isLoading, isError } = useTutorialList();
  const { data: tutorialCategoryData } =
    useTutorialByCategory(selectedCategory);

  const categories = groupByCategoryWithCount(tutorialData);

  useEffect(() => {
    console.log(
      tutorialCategoryData,
      "tutorialCategoryData on tutorial page.jsx"
    );
  }, [tutorialCategoryData]);

  useEffect(() => {
    console.log(tutorialData, "tutorialData Data on tutorial page.jsx");
  }, [tutorialData]);

  const handleGetTutorialByCategory = (slug) => {
    setSelectedCategory(slug);
    setSearch("");
    setPage(1);
  };

  const baseList = selectedCategory
    ? tutorialCategoryData || []
    : tutorialData || [];

  const searchedList = (baseList || []).filter((item) => {
    const q = search.toLowerCase();
    return (
      item?.post_title?.toLowerCase().includes(q) ||
      item?.excerpt?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil((searchedList?.length || 0) / pageSize);

  const paginatedList = searchedList?.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [paginatedList, pageSize, page, selectedCategory, search, totalPages]);

  if (isLoading) return <PostListSkeleton title="Tutorials" />;

  return (
    <>
      <PageBreadcrumbs title={"Tutorials"} />

      <section className="tutorials-page py-4 py-lg-5">
        <div className="container">
          <div className="row g-4">

            <div className="col-lg-8">
              <div className="posts-grid">
                {paginatedList?.map((item) => (
                  <PostCard
                    key={item?.ID}
                    cardData={item}
                    type="tutorials"
                  />
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
                  key={selectedCategory}
                  className="mb-4"
                  onSearch={(query) => {
                    setSearch((prev) => {
                      if (prev === query) return prev;
                      setPage(1);
                      return query;
                    });
                  }}
                />

                <h4 className="text-muted mb-3">Popular Category</h4>

                <ul className="categories-list unstyled rounded-3 p-3 p-lg-4 d-flex flex-column gap-2 gap-lg-3">

                  <li
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearch("");
                      setPage(1);
                    }}
                    className="d-flex align-items-center justify-content-between rounded-3"
                    style={{ cursor: "pointer", fontWeight: 600 }}
                  >
                    <span>All</span>
                  </li>

                  {categories?.map((item) => (
                    <li
                      onClick={() =>
                        handleGetTutorialByCategory(item?.category_slug)
                      }
                      key={item?.category_slug}
                      className="d-flex align-items-center justify-content-between rounded-3"
                      style={{ cursor: "pointer" }}
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

export default TutorialsPage;