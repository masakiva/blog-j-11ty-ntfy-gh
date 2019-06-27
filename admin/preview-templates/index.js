import Post from "/admin/preview-templates/post.js";

// Register the Post component as the preview for entries in the blog collection
CMS.registerPreviewTemplate("articles", Articles);

CMS.registerPreviewStyle("/_includes/assets/inline.css");
// Register any CSS file on the home page as a preview style
fetch("/")
  .then(response => response.text())
  .then(html => {
    const f = document.createElement("html");
    f.innerHTML = html;
    Array.from(f.getElementsByTagName("link")).forEach(tag => {
      if (tag.rel == "stylesheet" && !tag.media) {
        CMS.registerPreviewStyle(tag.href);
      }
    });
  });
