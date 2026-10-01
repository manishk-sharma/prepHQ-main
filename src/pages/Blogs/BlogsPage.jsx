import React, { useEffect, useState } from "react";
import PostCard from "../../components/PostCard";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import SearchWithDebounce from "../../components/SearchWithDebounce";

import {
  useBlogList,
  useBlogByCategory,
} from "../../services/blogServices"; // <- path apne project ke hisaab se adjust kar lena

import { groupByCategoryWithCount } from "../../utils/helper";
import PageBreadcrumbs from "../../components/PageBreadcrumbs";
import PostListSkeleton from "../../skeletons/PostListSkeleton";

const GREEN = "#58C99A";

const BlogsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [search, setSearch] = useState("");

  const { data: blogData, isLoading, isError } = useBlogList();
  const { data: blogCategoryData } = useBlogByCategory(selectedCategory);

  const categories = groupByCategoryWithCount(blogData);

  const handleGetBlogByCategory = (slug) => {
    setSelectedCategory(slug);
    setSearch("");
    setPage(1);
  };

  const baseList = selectedCategory
    ? blogCategoryData || []
    : blogData || [];

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
  }, [paginatedList, page, selectedCategory, search]);

  useEffect(() => {
    console.log(paginatedList, "paginatedList on blog page.jsx");
  }, [paginatedList]);

  if (isLoading) return <PostListSkeleton title="Blogs" />;

  return (
    <>
      <PageBreadcrumbs title={"Blogs"} />

      <section className="tutorials-page py-4 py-lg-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="posts-grid">
                {paginatedList?.map((item) => (
                  <PostCard
                    key={item?.ID}
                    cardData={item}
                    type="blogs"
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
                        handleGetBlogByCategory(item?.category_slug)
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

export default BlogsPage;