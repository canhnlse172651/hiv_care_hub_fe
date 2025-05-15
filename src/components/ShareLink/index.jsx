import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  InstapaperShareButton,
  PinterestShareButton,
} from "react-share";

const ShareLink = ({ path, title, children }) => {
  return (
    <>
      {title === "twitter" && (
        <TwitterShareButton url={path}>
          <a href="#" className="social-icon share-link" title={title} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        </TwitterShareButton>
      )}
      {title === "instagram" && (
        <InstapaperShareButton url={path}>
          <a href="#" className="social-icon share-link" title={title} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        </InstapaperShareButton>
      )}
      {title === "pinterest" && (
        <PinterestShareButton url={path}>
          <a href="#" className="social-icon share-link" title={title} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        </PinterestShareButton>
      )}
      {!["twitter", "instagram", "pinterest"].includes(title) && (
        <FacebookShareButton url={path}>
          <a href="#" className="social-icon share-link" title={title} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        </FacebookShareButton>
      )}
    </>
  );
};

export default ShareLink;
