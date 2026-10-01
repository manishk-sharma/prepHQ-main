import React, { useEffect, useState } from "react";
import { formatDate, getReadingTime } from "../../../../utils/helper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import favicon from "../../../../assets/img/favicon.svg";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Badge,
} from "@mui/material";
import parse from "html-react-parser";
import { TbWindowMinimize } from "react-icons/tb";
import { VscChromeMaximize } from "react-icons/vsc";
import { AUTHORS } from "../commons/commons";

 export const PreviewModal = React.memo(({ open, onClose, previewData, formValues }) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [toc, setToc] = useState([]);
    const [parsedContent, setParsedContent] = useState(null);

    console.log("Preview Modal Rendered", previewData);
    useEffect(() => {
      if (!open || !previewData?.post_content) return;

      const parser = new DOMParser();
      const doc = parser.parseFromString(previewData.post_content, "text/html");
      const headings = Array.from(doc.querySelectorAll("h2, h3"));

      const tocItems = headings.map((el, index) => {
        const id = `preview-toc-${index}`;
        el.setAttribute("id", id);
        return {
          id,
          text: el.textContent.trim(),
          type: el.tagName.toLowerCase(),
        };
      });

      setToc(tocItems);
      setParsedContent(doc.body.innerHTML);
    }, [previewData?.post_content, open]);

    const readingTime = getReadingTime(previewData?.post_content || "");

    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={isFullScreen}
        maxWidth="lg"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: isFullScreen ? 0 : 2,
            height: isFullScreen ? "100vh" : "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0",
            bgcolor: "#f8f9fa",
            py: 2,
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <VisibilityIcon sx={{ color: "#074568" }} />
            <span>Post Preview</span>
            <Badge
              className="text-nowrap"
              badgeContent="Draft Preview"
              color="warning"
              sx={{ ml: 5 }}
            />
          </div>

          <div className="d-flex align-items-center gap-2">
            {/* Full Screen Toggle */}
            <IconButton
              onClick={() => setIsFullScreen(!isFullScreen)}
              title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
            >
              {isFullScreen ? <TbWindowMinimize /> : <VscChromeMaximize />}
            </IconButton>

            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent sx={{ p: 0, overflowY: "auto" }}>
                    
          <div className="post-detail-page py-4 py-lg-5">
                        
            <div className="container">
                            
              <div className="row g-4">
                                
                <div className="col-lg-8">
                                    {/* Author & Meta Info */}
                                    
                  <div className="d-flex justify-content-between gap-3 gap-lg-4 align-items-start align-items-lg-center flex-column flex-lg-row">
                                        
                    <div className="d-flex gap-2 gap-lg-3 align-items-center">
                                            
                      <img
                        className="rounded-circle avatar"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                        src={
                          AUTHORS.find(
                            (a) => a.id === Number(previewData.author_id),
                          )?.image || favicon
                        }
                        alt={
                          AUTHORS.find(
                            (a) => a.id === Number(previewData.author_id),
                          )?.name || "Prephq"
                        }
                      />
                                            
                      <p className="author-name mb-0 text-muted-2 fw-semibold">
                                                
                        {AUTHORS.find(
                          (a) => a.id === Number(previewData.author_id),
                        )?.name || "Prephq"}
                                              
                      </p>
                                          
                    </div>
                                        
                    <div className="d-flex gap-2 gap-lg-3 align-items-center flex-wrap">
                                            
                      <div className="d-flex gap-3 align-items-center">
                                                
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="23"
                          height="20"
                          viewBox="0 0 23 20"
                          fill="none"
                        >
                                                    {/* Calendar icon SVG */}
                                                  
                        </svg>
                                                
                        <div className="text-muted-2 fw-semibold">
                                                    
                          {formatDate(previewData.post_date)}
                                                  
                        </div>
                                              
                      </div>
                                            
                      <div className="d-flex gap-3 align-items-center">
                                                
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                                                    {/* Clock icon SVG */}
                                                  
                        </svg>
                                                
                        <div className="text-muted-2 fw-semibold">
                           {readingTime} Minutes Read{" "}
                        </div>
                                              
                      </div>
                                            
                      {previewData.category_name
                        ?.split(",")
                        ?.map((cat, index) => (
                          <div
                            key={index}
                            className="category-name rounded-3 px-3 py-2"
                          >
                                                      {cat.trim()}
                                                    
                          </div>
                        ))}
                                          
                    </div>
                                      
                  </div>
                                    {/* TOC */}
                                    
                  {toc.length > 0 && (
                    <>
                                            
                      <div className="head mt-4 text-muted-2 fw-bold fs-6">
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
                                              
                      </ul>
                                          
                    </>
                  )}
                                    {/* Title */}
                                    
                  <h1 className="mt-3">
                    {previewData.post_title || "Untitled Draft"}
                  </h1>
                                    {/* Feature Image Preview */}
                                    
                  {previewData.featured_image && (
                    <div className="my-4">
                                            
                      <img
                        src={previewData.featured_image}
                        alt={previewData.post_title}
                        style={{ maxWidth: "100%", borderRadius: "8px" }}
                      />
                                          
                    </div>
                  )}
                                    {/* Content */}
                                    
                  <div className="content mb-4 mb-lg-5">
                                        
                    {previewData.post_content ? (
                      parse(previewData.post_content)
                    ) : (
                      <div className="text-muted text-center py-5">
                                                No content added yet. Start
                        writing in the editor to see preview.
                                              
                      </div>
                    )}
                                      
                  </div>
                                    {/* About Author */}
                                    
                  <div className="about-author rounded-3 d-flex gap-3 p-3 align-items-start mb-3 mb-lg-4">
                                        
                    <img
                      className="rounded-circle avatar"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                      src={
                        AUTHORS.find(
                          (a) => a.id === Number(previewData.author_id),
                        )?.image || favicon
                      }
                      alt={
                        AUTHORS.find(
                          (a) => a.id === Number(previewData.author_id),
                        )?.name || "Prephq"
                      }
                    />
                                        
                    <div>
                                            
                      <h4 className="mb-0 heading">
                                                About The Author{" "}
                        {AUTHORS.find(
                          (a) => a.id === Number(previewData.author_id),
                        )?.name || "Prephq"}
                                              
                      </h4>
                                            
                      <p className="desc mb-0">
                                                
                        {AUTHORS.find(
                          (a) => a.id === Number(previewData.author_id),
                        )?.quote || "No bio provided."}
                      </p>
                                          
                    </div>
                                      
                  </div>
                                  
                </div>
                                
                <div className="col-lg-4">
                                    
                  <div className="sticky-div">
                                        {/* Preview Notice */}
                                        
                    <div className="alert alert-info mb-4">
                                            <strong>Preview Mode</strong>
                                            
                      <p className="mb-0 small">
                        This is how your post will appear when published.
                        Complete all required fields before publishing.
                      </p>
                                          
                    </div>
                                                             
                   
                                         
                    {(!previewData.post_title ||
                      !previewData.author_id ||
                      !previewData.featured_image) && (
                      <div className="alert alert-warning mb-4">
                                                
                        <strong>Missing Required Fields:</strong>
                                                
                        <ul className="mb-0 mt-2">
                                                    
                          {!formValues.post_title && <li>Post Title</li>}
                                                    
                          {!formValues.author_id && <li>Author Selection</li>}
                                                    
                          {!formValues.feature_image && <li>Feature Image</li>}
                                                  
                        </ul>
                                              
                      </div>
                    )}
                                      
                  </div>
                                  
                </div>
                              
              </div>
                          
            </div>
                      
          </div>
                  
        </DialogContent>
      </Dialog>
    );
  });

  