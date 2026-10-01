import React, { useEffect, useRef, useState } from "react";
import placeholder from "../assets/img/prepHq_placeholder_image.webp";

const LazyImage = ({ src, alt = "", className = "", style = {} }) => {
  const imgRef   = useRef(null);
  const [inView,  setInView]  = useState(false);
  const [loaded,  setLoaded]  = useState(false);
  const [errored, setErrored] = useState(false);

  // Trigger load once image enters the viewport
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const showReal = inView && !errored;
  const fullyVisible = showReal && loaded;

  return (
    <div ref={imgRef} style={{ position: "relative", overflow: "hidden", ...style }}>
      {/* Placeholder — always mounted, fades out when real image is ready */}
      <img
        src={placeholder}
        alt=""
        aria-hidden="true"
        className={className}
        style={{
          position: fullyVisible ? "absolute" : "relative",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: fullyVisible ? 0 : 1,
          transition: "opacity 0.35s ease",
          pointerEvents: "none",
        }}
      />

      {/* Real image — starts invisible, fades in on load */}
      {showReal && (
        <img
          src={src}
          alt={alt}
          className={className}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.35s ease",
          }}
        />
      )}
    </div>
  );
};

export default LazyImage;
