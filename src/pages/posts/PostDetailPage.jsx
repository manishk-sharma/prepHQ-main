import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import SearchWithDebounce from "../../components/SearchWithDebounce";
import { usePostDetail } from "../../hooks/usePostDetail";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import {
  buildSeoKeywords,
  formatDate,
  generateSeoMeta,
  getReadingTime,
  groupByCategoryWithCount,
  parseSeoTags,
  useFakeLikes,
} from "../../utils/helper";
import parse from "html-react-parser";
import favicon from "../../assets/img/favicon.svg";
import PostCard from "../../components/PostCard";
import { useInterviewList } from "../../services/interviewsServices";
import { useProjectList } from "../../services/projectsServices";
import { useTutorialList } from "../../services/tutorialServices";
import { useBlogList } from "../../services/blogServices";
import TableOfContents from "../../components/TableOfContents";
import { useTOC } from "../../context/useTOCContext";
import NewSideBar from "../../components/NewSideBar";
import PostDetailSkeleton from "../../skeletons/PostDetailSkeleton";
import LazyImage from "../../components/LazyImage";
const PostDetailPage = () => {
  const { type, postSlug } = useParams();
  const { isTOCOpen, setIsTOCOpen } = useTOC();

  const location = useLocation();
  const navigate = useNavigate();
  // const [likes, setLikes] = useState(1000);
  // const [liked, setLiked] = useState(false);

  const stateId = location.state?.id;

  const [resolvedId, setResolvedId] = useState(stateId || null);

  const [toc, setToc] = useState([]);
  const [parsedContent, setParsedContent] = useState(null);

  const listHookByType = {
    interviews: useInterviewList,
    projects: useProjectList,
    tutorials: useTutorialList,
    blogs: useBlogList,
  };
  const listHook = listHookByType[type];

  const { data: relatedSourceData = [], isLoading: isListLoading } = listHook ? listHook() : { data: [], isLoading: false };

  const { data, isLoading } = usePostDetail(type, resolvedId);
  const { likes, liked, toggleLike } = useFakeLikes(data?.ID, type);

  const categories = groupByCategoryWithCount(relatedSourceData);

  useEffect(() => {
    if (isListLoading) return;
    if (!resolvedId) {
      const found = relatedSourceData?.find(
        (item) => item.post_name === postSlug,
      );
      if (found?.ID) {
        setResolvedId(found.ID);
      } else if (relatedSourceData?.length >= 0) {
        navigate("/404", { replace: true });
      }
    }
  }, [relatedSourceData, postSlug, resolvedId, isListLoading]);

  useEffect(() => {
    if (!data?.post_content) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(data.post_content, "text/html");

    const headings = Array.from(doc.querySelectorAll("h2, h3"));

    const tocItems = headings.map((el, index) => {
      const id = `toc-${el.tagName.toLowerCase()}-${index}`;
      el.setAttribute("id", id);

      return {
        id,
        text: el.textContent.trim(),
        type: el.tagName.toLowerCase(),
      };
    });

    setToc(tocItems);
    setParsedContent(doc.body.innerHTML);
  }, [data?.post_content]);

  // useEffect(() => {
  //   console.log(data, "data on detail page.jsx", resolvedId);
  //   console.log(categories, "categories on detail page.jsx");
  // }, [data]);

  useEffect(() => {
    const blocks = document.querySelectorAll(".content pre");

    blocks.forEach((pre) => {
      if (pre.classList.contains("code-enhanced")) return;

      pre.classList.add("code-enhanced");

      const wrapper = document.createElement("div");
      wrapper.className = "code-wrapper";

      const header = document.createElement("div");
      header.className = "code-header";

      const title = document.createElement("span");
      title.textContent = "Code";

      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.textContent = "Copy";

      btn.onclick = () => {
        const code = pre.innerText;
        navigator.clipboard.writeText(code);
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy"), 1200);
      };

      header.appendChild(title);
      header.appendChild(btn);

      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });
  }, [parsedContent]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [resolvedId, data]);


  if (isListLoading || isLoading) return <PostDetailSkeleton />;

  const handleGetInterviewByCategory = (slug) => {
    navigate(`/${type}/category/${slug}`);
  };

  const pageUrl = window.location.href;
  const title = data?.post_title || "";

  const shareText = `${title} : ${pageUrl}`;

  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedText = encodeURIComponent(shareText);

  const socials = [
    {
      name: "whatsapp",
      href: `https://api.whatsapp.com/send?text=${encodedText}`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M20.0005 9.41622V10.5906C19.9883 10.6601 19.9736 10.7296 19.9638 10.7996C19.9036 11.2179 19.8727 11.6422 19.7807 12.0532C19.1596 14.8268 17.6374 16.9789 15.2341 18.487C13.2199 19.7509 11.0115 20.2075 8.65422 19.9104C7.37199 19.7516 6.13558 19.3331 5.02044 18.6808C4.96078 18.6437 4.89348 18.6206 4.82362 18.6133C4.75375 18.606 4.68315 18.6147 4.61712 18.6387C3.5403 18.9621 2.46054 19.2782 1.38225 19.5963L0 20.0024C0.0239838 19.9119 0.0386689 19.8503 0.0562896 19.7901C0.488487 18.325 0.918233 16.86 1.3563 15.3968C1.38192 15.3245 1.39083 15.2473 1.38235 15.171C1.37387 15.0948 1.34823 15.0214 1.30736 14.9564C0.575621 13.6899 0.140521 12.274 0.0347501 10.8152C-0.142436 8.5183 0.383249 6.3897 1.66907 4.47641C3.25249 2.12027 5.45214 0.67185 8.25237 0.156582C8.62191 0.0885652 8.99734 0.0523554 9.36982 0.00146484H10.5445L10.9684 0.0503981C12.6062 0.231451 14.1264 0.751122 15.493 1.67694C17.8522 3.27657 19.3196 5.47318 19.8458 8.28293C19.9143 8.6558 19.9491 9.03748 20.0005 9.41622ZM1.72977 18.2609C1.81248 18.2404 1.85067 18.233 1.88738 18.2223C2.86631 17.9335 3.84523 17.6439 4.82416 17.3532C4.881 17.3332 4.94182 17.3272 5.00147 17.3357C5.06112 17.3442 5.11783 17.367 5.16679 17.4021C7.2661 18.7268 9.53183 19.1339 11.9566 18.5971C16.2791 17.6399 19.2638 13.4767 18.7822 9.07956C18.5957 7.37571 17.9952 5.82501 16.8899 4.51213C14.5939 1.7841 11.6625 0.702677 8.15545 1.37649C5.83148 1.82325 4.0097 3.11117 2.68374 5.06655C1.41749 6.93335 0.965711 9.00665 1.25841 11.2365C1.42836 12.5251 1.88805 13.7584 2.60297 14.8439C2.6361 14.8905 2.65731 14.9444 2.66473 15.0011C2.67215 15.0577 2.66557 15.1153 2.64556 15.1688C2.44977 15.8025 2.26524 16.4411 2.07729 17.0748C1.96324 17.4579 1.85164 17.842 1.72977 18.2609Z"
            fill="#57CC99"
          ></path>
          <path
            d="M13.2983 15.3875C10.6963 15.2535 8.49515 14.2308 6.78838 12.2255C5.63912 10.8739 4.97737 9.28948 4.76836 7.52446C4.67537 6.73664 4.70131 5.95224 4.98617 5.19524C5.21377 4.58994 5.65233 4.151 6.16578 3.80211C6.64595 3.47573 7.24554 3.57849 7.68312 4.00714C8.29838 4.60755 8.90678 5.21286 9.50687 5.83039C10.0301 6.36866 10.0179 7.08553 9.49806 7.63016C9.36297 7.77157 9.21906 7.90418 9.08495 8.04609C8.77169 8.37541 8.76043 8.78009 9.07271 9.11088C9.67573 9.7506 10.2846 10.3846 10.8994 11.0129C11.2166 11.3378 11.7095 11.3378 12.0423 11.0276C12.2283 10.8549 12.3991 10.665 12.5929 10.5021C13.0599 10.1106 13.6972 10.1179 14.1705 10.505C14.2216 10.5459 14.2706 10.5893 14.3173 10.6351C14.8982 11.2145 15.4785 11.7947 16.0583 12.3757C16.6232 12.9448 16.6256 13.6719 16.0686 14.2464C15.7147 14.6115 15.3687 14.9897 14.8587 15.1409C14.6357 15.2115 14.408 15.2664 14.1773 15.3053C13.8959 15.3479 13.6091 15.3601 13.2983 15.3875ZM13.2885 14.2029C14.0418 14.222 14.7299 14.0874 15.2228 13.442C15.2938 13.3485 15.3261 13.2952 15.2312 13.2017C14.648 12.6249 14.0679 12.0451 13.4906 11.4621C13.4059 11.377 13.3438 11.3838 13.264 11.467C13.1172 11.6221 12.9644 11.7758 12.8049 11.9192C12.055 12.5939 10.8593 12.6042 10.1383 11.8996C9.4447 11.2223 8.77707 10.5172 8.12511 9.79986C7.61753 9.24202 7.52258 8.3666 7.90338 7.72362C8.09182 7.40507 8.37376 7.14131 8.62094 6.85897C8.69338 6.77529 8.7438 6.71804 8.64297 6.61773C8.05561 6.03542 7.47412 5.44823 6.88579 4.86739C6.85152 4.83362 6.74727 4.8116 6.72524 4.83362C6.46044 5.09786 6.15012 5.32296 6.03999 5.71442C5.81973 6.48121 5.87259 7.24995 6.03363 8.01429C6.45408 10.0059 7.46629 11.6275 9.1383 12.8063C10.3525 13.6742 11.7979 14.1604 13.2899 14.2029H13.2885Z"
            fill="#57CC99"
          ></path>
        </svg>
      ),
    },
    {
      name: "Linkedin",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="23"
          viewBox="0 0 24 23"
          fill="none"
        >
          <path
            d="M6.46255 22.4354H0.564453V7.45952H6.46255V22.4354ZM1.54724 21.469H5.47931V8.42596H1.54724V21.469Z"
            fill="#57CC99"
          ></path>
          <path
            d="M23.1732 22.4354H17.275V14.2228C17.275 13.4223 16.6148 12.7733 15.8004 12.7733C14.986 12.7733 14.3258 13.4223 14.3258 14.2228V22.4354H8.42767V7.45952H14.3258V8.43186C15.2158 7.79921 16.2867 7.45907 17.3853 7.45952C20.5741 7.45952 23.1727 10.0019 23.1727 13.1298L23.1732 22.4354ZM18.2583 21.469H22.1904V13.1298C22.1839 10.5275 20.0338 8.42233 17.3862 8.42551C16.176 8.42551 15.0396 8.92664 14.1915 9.8323L13.3434 10.7443V8.42551H9.41138V21.469H13.3434V14.2228C13.3434 12.8885 14.4439 11.8073 15.8009 11.8073C17.1579 11.8073 18.2583 12.8885 18.2583 14.2228V21.469Z"
            fill="#57CC99"
          ></path>
          <path
            d="M3.51327 6.49354C1.88452 6.49354 0.564453 5.19559 0.564453 3.59469C0.564453 1.99379 1.88452 0.696289 3.51327 0.696289C5.14202 0.696289 6.46209 1.99424 6.46209 3.59469C6.45886 5.19423 5.14064 6.49037 3.51327 6.49354ZM3.51327 1.66272C2.42759 1.66272 1.54724 2.52803 1.54724 3.59514C1.54724 4.66226 2.42759 5.52756 3.51327 5.52756C4.59895 5.52756 5.47931 4.66226 5.47931 3.59514C5.47931 2.52803 4.59895 1.66272 3.51327 1.66272Z"
            fill="#57CC99"
          ></path>
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="24"
          viewBox="0 0 14 24"
          fill="none"
        >
          <path
            d="M8.09976 23.305H4.41967C3.80475 23.305 3.30474 22.8131 3.30474 22.2081V14.0416H1.1579C0.542984 14.0416 0.0429688 13.5497 0.0429688 12.9447V9.44524C0.0429688 8.84028 0.542984 8.34836 1.1579 8.34836H3.30518V6.59619C3.30518 4.85859 3.85996 3.38063 4.90891 2.32173C5.96236 1.25842 7.43457 0.696289 9.16712 0.696289L11.9738 0.700705C12.5873 0.701588 13.0864 1.1935 13.0864 1.79758V5.0467C13.0864 5.65166 12.5864 6.14357 11.972 6.14357L10.0823 6.14445C9.506 6.14445 9.35923 6.25794 9.32781 6.29282C9.27619 6.35067 9.2147 6.51405 9.2147 6.9649V8.34924H11.8301C12.0272 8.34924 12.2179 8.39693 12.3818 8.48702C12.7354 8.68131 12.9554 9.04914 12.9554 9.44612L12.954 12.9456C12.954 13.5501 12.454 14.042 11.8391 14.042H9.2147V22.2086C9.2147 22.8135 8.71468 23.305 8.09976 23.305ZM4.65217 21.9794H7.86726V13.4481C7.86726 13.0445 8.2012 12.716 8.61145 12.716H11.6066L11.6079 9.67441H8.61145C8.2012 9.67441 7.86726 9.34588 7.86726 8.94228V6.96446C7.86726 6.44649 7.92067 5.85787 8.3179 5.41497C8.79817 4.87978 9.55447 4.81796 10.0819 4.81796L11.739 4.81708V2.02587L9.16577 2.0219C6.38203 2.0219 4.65172 3.77496 4.65172 6.59707V8.94272C4.65172 9.34632 4.31778 9.67486 3.90754 9.67486H1.39041V12.7164H3.90799C4.31823 12.7164 4.65217 13.045 4.65217 13.4486V21.9794Z"
            fill="#57CC99"
          ></path>
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: null,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="23"
          height="23"
          viewBox="0 0 23 23"
          fill="none"
        >
          <path
            d="M16.3049 0.565918H6.5631C3.25581 0.565918 0.564453 3.25743 0.564453 6.56492V16.3061C0.564453 19.6148 3.25581 22.305 6.5631 22.305H16.3037C19.6122 22.305 22.3036 19.6135 22.3036 16.3061V6.56492C22.3036 3.25743 19.6122 0.565918 16.3037 0.565918H16.3049ZM20.3748 16.3073C20.3748 18.5526 18.5488 20.3774 16.3037 20.3774H6.5631C4.31923 20.3774 2.49328 18.5513 2.49328 16.3073V6.56492C2.49328 4.32092 4.31923 2.49486 6.5631 2.49486H16.3037C18.5475 2.49486 20.3748 4.32092 20.3748 6.56492V16.3073Z"
            fill="#57CC99"
          ></path>
          <path
            d="M11.434 5.83449C8.34533 5.83449 5.83271 8.34725 5.83271 11.4361C5.83271 14.525 8.34533 17.0378 11.434 17.0378C14.5227 17.0378 17.0353 14.525 17.0353 11.4361C17.0353 8.34725 14.5227 5.83449 11.434 5.83449ZM11.434 15.1088C9.40875 15.1088 7.76154 13.4615 7.76154 11.4361C7.76154 9.41074 9.40875 7.76343 11.434 7.76343C13.4593 7.76343 15.1065 9.41074 15.1065 11.4361C15.1065 13.4615 13.4593 15.1088 11.434 15.1088Z"
            fill="#57CC99"
          ></path>
          <path
            d="M17.2706 4.19875C16.899 4.19875 16.5338 4.34921 16.2715 4.61283C16.0079 4.87517 15.8562 5.24038 15.8562 5.61331C15.8562 5.98623 16.0079 6.35016 16.2715 6.61378C16.5338 6.87612 16.899 7.02786 17.2706 7.02786C17.6423 7.02786 18.0074 6.87612 18.2711 6.61378C18.5347 6.35016 18.6851 5.98495 18.6851 5.61331C18.6851 5.24166 18.5347 4.87517 18.2711 4.61283C18.0087 4.34921 17.6435 4.19875 17.2706 4.19875Z"
            fill="#57CC99"
          ></path>
        </svg>
      ),
    },
  ];

  const seo = generateSeoMeta(data || {});

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>

        <meta name="description" content={seo.description} />

        <meta name="keywords" content={seo.keywords} />

        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={seo.image} />
        <meta property="og:url" content={seo.url} />
        <meta property="og:type" content="article" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={seo.image} />
      </Helmet>

      <section className={`${isTOCOpen? "": ""} post-detail-page py-4 py-lg-5`}>
        <div className="custom-container">
          <div className="row g-4 ">
            <div className="col-md-4 col-lg-3">
               <NewSideBar toc={toc}/>
             
            </div>
            <div className="col-md-8 col-lg-6">
              <div className="d-flex justify-content-between gap-2 gap-lg-3 align-items-start align-items-lg-center flex-column flex-lg-row">
                <div className="d-flex gap-1 gap-lg-2 align-items-center">
                  <LazyImage
                    src={data?.author_image || favicon}
                    alt={data?.author_name || "Author"}
                    className="rounded-circle avatar"
                    style={{ width: "50px", height: "50px", borderRadius: "50%", flexShrink: 0 }}
                  />
                  <p className="author-name mb-0  fw-semibold">
                    {data?.author_name || "Prephq"}
                  </p>
                </div>
                <div className="d-flex gap-1 gap-lg-2 align-items-center flex-wrap">
                  <div className="d-flex gap-2 align-items-center">
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
                    <div className=" fw-semibold">
                      {formatDate(data?.post_date) || "Feb 1, 2023"}
                    </div>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M10.0076 8.08374e-06C15.528 0.00696627 20.009 4.49569 20 10.01C19.9909 15.5244 15.4737 20.0243 9.97913 19.9999C4.46925 19.9749 -0.00208608 15.4917 7.30151e-07 9.99474C0.00208754 4.47899 4.4936 -0.0069501 10.0076 8.08374e-06ZM11.1067 7.54685V5.7252C11.1067 5.7078 11.1067 5.69041 11.1067 5.67301C11.0879 5.03634 10.6198 4.5597 10.0083 4.55275C9.39691 4.54579 8.89955 5.03356 8.89538 5.68345C8.88842 7.14954 8.89538 8.61563 8.89538 10.0817C8.8914 10.2339 8.91868 10.3853 8.97551 10.5265C9.03234 10.6677 9.11752 10.7958 9.22579 10.9028C9.96035 11.6403 10.6866 12.3897 11.4427 13.1023C11.6514 13.2798 11.907 13.3934 12.1786 13.4293C12.6301 13.4947 13.0509 13.2018 13.2373 12.7836C13.4286 12.3536 13.35 11.8964 12.9987 11.5374C12.4276 10.955 11.8419 10.3872 11.2757 9.79782C11.181 9.69307 11.125 9.55897 11.1171 9.41791C11.0977 8.79654 11.1067 8.17169 11.1067 7.54685Z"
                        fill="#37AB79"
                      ></path>
                    </svg>
                    <div className=" fw-semibold">
                      {getReadingTime(data?.post_content)} Minutes Read
                    </div>
                  </div>
                  {data?.category_name?.split(",")?.map((cat, index) => (
                    <div
                      key={index}
                      className="category-name rounded-3 px-2 py-1"
                    >
                      {cat.trim()}
                    </div>
                  ))}
                </div>
              </div>
                  {/* <TableOfContents toc={toc} /> */}
              {/* TOC */}
              {/* <div class="head mt-4 text-white fw-bold fs-6">
                Table of Contents
              </div>

              <ul className="list-unstyled text-decoration-none mt-2 d-flex flex-wrap gap-2 justify-content-center justify-content-lg-start align-items-center rounded-2 px-2 py-1 py-lg-2 toc">
                {toc.map((item) => (
                  <li key={item.id} className="px-2 py-1 rounded-3">
                    <button
                      type="button"
                      className="text-decoration-none bg-transparent border-0 p-0"
                      onClick={() => {
                        const el = document.getElementById(item.id);
                        if (el) {
                          el.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }}
                    >
                      {item.text}
                    </button>
                  </li>
                ))}
              </ul> */}

              <h1 className="mt-3">{data?.post_title}</h1>

              <div className="content mb-4 mb-lg-5">
                {parse(parsedContent || "")}
              </div>

              <div className="about-author  rounded-3 d-flex gap-3 p-3 align-items-start mb-3 mb-lg-4">
                <LazyImage
                  src={data?.author_image || favicon}
                  alt={data?.author_name || "Author"}
                  className="rounded-circle avatar"
                  style={{ width: "50px", height: "50px", borderRadius: "50%", flexShrink: 0 }}
                />
                <div className="">
                  <h4 className=" mb-0 heading">
                    Author - {data?.author_name || "Prephq"}
                  </h4>
                  <p className="desc mb-0">
                    {data?.author_quote ||
                      "Prephq is a leading platform for interview preparation, offering comprehensive resources, expert guidance, and personalized coaching to help candidates excel in their job interviews."}
                  </p>
                  {data?.author_linkedin && (
                    <a
                      href={data.author_linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "15px",
                        color: "#0A66C2",
                        fontSize: "16px",
                        textDecoration: "none",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >  <span className="fw-semibold text-black">Linkedin:</span>
                      <LinkedInIcon fontSize="medium" />
                    
                    </a>
                 )} 
                </div>
              </div>

              <h4 class=" mb-3 mb-lg-4">Related Posts</h4>
              <div className="posts-grid related-post">
                {relatedSourceData
                  ?.filter((item) => item.post_name !== postSlug)
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 2)
                  .map((item) => (
                    <PostCard key={item?.ID} cardData={item} type={type} />
                  ))}
              </div>
            </div>
            <div className="d-none d-lg-block  col-lg-3">
              <div className="sticky-div">
                <div className="like-wrapper mb-4">
                  <div className="like-icon-container" onClick={toggleLike}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className={`like-icon ${liked ? "liked" : ""}`}
                    >
                      <path d="M8 10V20M8 10L4 9.99998V20L8 20M8 10L13.1956 3.93847C13.6886 3.3633 14.4642 3.11604 15.1992 3.29977L15.2467 3.31166C16.5885 3.64711 17.1929 5.21057 16.4258 6.36135L14 9.99998H18.5604C19.8225 9.99998 20.7691 11.1546 20.5216 12.3922L19.3216 18.3922C19.1346 19.3271 18.3138 20 17.3604 20L8 20" />
                    </svg>

                    {liked && (
                      <svg viewBox="0 0 50 50" className="celebrate">
                        <polygon points="25,2 25,10"></polygon>
                        <polygon points="25,48 25,40"></polygon>
                        <polygon points="2,25 10,25"></polygon>
                        <polygon points="48,25 40,25"></polygon>
                        <polygon points="8,8 14,14"></polygon>
                        <polygon points="42,8 36,14"></polygon>
                        <polygon points="8,42 14,36"></polygon>
                        <polygon points="42,42 36,36"></polygon>
                      </svg>
                    )}
                  </div>

                  <span className="like-text">Liked By {likes}</span>
                </div>

                <div className="d-flex gap-3 align-items-center mb-4 ">
                  <h4 className="">Share:</h4>

                  <div className="d-flex align-items-center gap-2">
                    {socials.map((item, index) => {
                      // Instagram → copy link
                      if (item.name === "instagram") {
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(pageUrl);
                              alert("Link copied for Instagram");
                            }}
                            className="text-decoration-none social-icon d-flex justify-content-center align-items-center rounded-3 border-0 bg-transparent"
                          >
                            {item.icon}
                          </button>
                        );
                      }

                      return (
                        <a
                          key={index}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none social-icon d-flex justify-content-center align-items-center rounded-3"
                        >
                          {item.icon}
                        </a>
                      );
                    })}
                  </div>
                </div>

                <h4 className=" mb-3">Popular Category</h4>
                <ul className="categories-list unstyled rounded-3 p-3 p-lg-4 d-flex flex-column gap-2 gap-lg-3 ">
                  {categories?.map((item, index) => (
                    <li
                      onClick={() =>
                        handleGetInterviewByCategory(item?.category_slug)
                      }
                      key={item?.category_slug}
                      className="d-flex align-items-center justify-content-between  rounded-3"
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

export default PostDetailPage;
