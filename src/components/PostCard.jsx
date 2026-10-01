import React, { useEffect, useMemo, useState } from "react";
import { IoHeartSharp } from "react-icons/io5";
import { IoHeartOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { formatDate, useFakeLikes } from "../utils/helper";
import favicon from "../assets/img/favicon.svg";
import { useProject } from "../services/projectsServices";
import LazyImage from "./LazyImage";

const PostCard = ({ cardData, type }) => {
   const {
    post_title,
    post_content,
    post_name,
    post_date,
    featured_image,
    ID,
    category_name,
    category_slug,
    author_name,
    author_image,
    author_quote,
  } = cardData;
  const { likes, liked } = useFakeLikes(ID, type);

 
  const [showAllCategories, setShowAllCategories] = useState(false);

  // category_name aur category_slug dono ko pair karo
  const categories = useMemo(() => {
    if (!category_name) return [];
    const names = category_name.split(",").map((c) => c.trim());
    const slugs = category_slug
      ? category_slug.split(",").map((s) => s.trim())
      : [];
    return names.map((name, i) => ({
      name,
      slug: slugs[i] || "",
    }));
  }, [category_name, category_slug]);

  useEffect(() => {
    console.log(cardData, "cardData");
  }, [cardData]);

  const CategoryBadge = ({ name, slug }) => (
    <Link
      to={`/${type}/category/${slug}`}
      className="text-decoration-none"
      onClick={(e) => e.stopPropagation()} // Read More link ke saath conflict na ho
    >
      <div className="category-name rounded-3 px-2 py-1 text-nowrap">
        {name}
      </div>
    </Link>
  );

  return (
    <div className="post-card rounded-4 d-flex flex-column gap-3">
      <div className="position-relative">
        <LazyImage
          src={featured_image}
          alt={post_title}
          className="img-fluid rounded-4 w-100"
          style={{ height: "212px", borderRadius: "1rem" }}
        />
      </div>

      <div
        className={`${showAllCategories ? "flex-wrap" : ""} d-flex justify-content-between gap-3 align-items-center`}
      >
        <div className="d-flex gap-3 align-items-center">
          <img
            className="rounded-circle"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
            src={author_image ? author_image : favicon}
          />
          <p className="author-name mb-0">{author_name || "Prephq"}</p>
        </div>

        <div className="d-flex gap-2 align-items-center">
          {categories.length === 1 && (
            <CategoryBadge
              name={categories[0].name}
              slug={categories[0].slug}
            />
          )}

          {categories.length > 1 && (
            <>
              {!showAllCategories ? (
                <>
                  <CategoryBadge
                    name={categories[0].name}
                    slug={categories[0].slug}
                  />

                  <div
                    className="category-name rounded-3 px-2 py-1 text-nowrap"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowAllCategories(true)}
                  >
                    +{categories.length - 1}
                  </div>
                </>
              ) : (
                categories.map((cat, index) => (
                  <CategoryBadge key={index} name={cat.name} slug={cat.slug} />
                ))
              )}
            </>
          )}
        </div>
      </div>

      <h5 className="title fw-bold text-black mb-0">{post_title}</h5>

      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex gap-3 align-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="20"
            viewBox="0 0 23 20"
            fill="none"
          >
            <path
              d="M23 19.5051C22.82 19.8908 22.5122 20.0006 22.0958 20C16.3758 19.9909 10.6558 19.9887 4.93585 19.9935C4.31966 19.9935 4.08626 19.7614 4.08626 19.1479V17.3279H4.36526C8.94684 17.3279 13.5282 17.3293 18.1094 17.3321C18.7772 17.3321 19.3292 17.119 19.8068 16.6615C21.1166 15.4065 22.0712 13.9159 22.814 12.2816C22.874 12.1553 22.934 12.0318 22.9976 11.9072L23 19.5051Z"
              fill="#37AB79"
            ></path>
            <path
              d="M23 3.99779H4.10726C4.0983 3.94574 4.09229 3.89324 4.08926 3.84054C4.08926 3.24061 4.08626 2.64128 4.08926 2.04135C4.08926 1.60639 4.36526 1.33402 4.80446 1.33283C5.82445 1.33283 6.83965 1.33283 7.85785 1.33283H8.13145C8.13145 1.11505 8.13145 0.910925 8.13145 0.706796C8.13565 0.291416 8.41464 5.67081e-05 8.80404 5.67081e-05C9.19344 5.67081e-05 9.47184 0.290822 9.47784 0.706202C9.47784 0.905584 9.47784 1.10437 9.47784 1.318H12.8468C12.8468 1.10971 12.8468 0.902617 12.8468 0.699674C12.8522 0.287855 13.136 -0.00350369 13.526 5.67081e-05C13.916 0.00361711 14.186 0.289636 14.1926 0.690774C14.1968 0.896683 14.1926 1.10259 14.1926 1.32037H17.6096C17.6096 1.12277 17.6096 0.918639 17.6096 0.715103C17.6138 0.296163 17.8856 0.00302371 18.2738 5.67081e-05C18.6728 -0.00469049 18.9524 0.289042 18.9566 0.71985C18.9566 0.912111 18.9566 1.10437 18.9566 1.33283H19.1966C20.1698 1.33283 21.143 1.34589 22.1156 1.3263C22.529 1.318 22.826 1.44498 22.9976 1.8212L23 3.99779Z"
              fill="#37AB79"
            ></path>
            <path
              d="M22.97 5.34718C22.9345 6.85701 22.7005 8.35585 22.274 9.80598C21.6608 11.8692 20.699 13.7491 19.223 15.3513C19.2175 15.3566 19.2123 15.3621 19.2074 15.3679C18.8396 15.8426 18.3818 16.0147 17.7548 16.0118C12.104 15.9868 6.45325 15.9963 0.801867 15.9993C0.501868 15.9993 0.253469 15.9293 0.0944693 15.6628C0.0159313 15.5346 -0.0150472 15.3834 0.00684816 15.235C0.0287435 15.0867 0.102148 14.9505 0.214469 14.8499C2.19446 12.9279 3.25706 10.543 3.76946 7.89405C3.91886 7.11907 3.96146 6.32451 4.05326 5.53885C4.05986 5.47951 4.06526 5.42017 4.07306 5.34955L22.97 5.34718Z"
              fill="#37AB79"
            ></path>
          </svg>

          <div>{formatDate(post_date)}</div>
        </div>
        <div className="likes d-flex align-items-center gap-2">
          {liked ? (
            <IoHeartSharp size={25} color="red" />
          ) : (
            <IoHeartOutline size={25} />
          )}
          <div>{likes.toLocaleString()}</div>
        </div>
      </div>

      {/* <Link className="text-decoration-none" to={`/${type}/${ID}`}>
        <div className="read-more rounded-3 px-3 py-2 text-center">
          Read More
        </div>
      </Link> */}
      <Link
        className="text-decoration-none"
        to={`/${type}/${post_name}`}
        state={{ id: ID }}
      >
        <div className="read-more rounded-3 px-3 py-2 text-center">
          Read More
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
