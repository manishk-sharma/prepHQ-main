import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Header from "../../components/HeaderBanner";

const Search = () => {
    const location = useLocation();

  useEffect(() => {
    if (!document.getElementById("google-cse-script")) {
      const script = document.createElement("script");
      script.id = "google-cse-script";
      script.async = true;
      script.src = "https://cse.google.com/cse.js?cx=62e3507d1db8d4295";
      document.body.appendChild(script);
    }

    const queryFromHash = new URLSearchParams(window.location.hash.replace("#", "")).get("gsc.q");

    const checkReady = setInterval(() => {
      if (window.google && window.google.search && window.google.search.cse) {
        try {
          const element = window.google.search.cse.element.getElement("searchresults");
          if (element && queryFromHash) {
            element.execute(queryFromHash);
            clearInterval(checkReady);
          }
        } catch (err) {
          console.error("Google CSE error:", err);
        }
      }
    }, 300);

    return () => clearInterval(checkReady);
  }, [location.hash]);

  return (
    <>
        <Header title="Search" highlight="Form" />
        <div className="container" style={{padding: "30px 0"}}>
            {/* Google Custom Search Element */}
           <div className="gcse-search" data-gname="searchresults"></div>
        </div>
    </>
  )
}

export default Search