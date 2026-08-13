module.exports = function (eleventyConfig) {
  // Copy assets and the admin panel straight through
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/admin");

  // Treatments, ordered by the "order" field
  eleventyConfig.addCollection("treatments", function (api) {
    return api.getFilteredByGlob("src/treatments/*.md")
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99));
  });

  // News posts, newest first
  eleventyConfig.addCollection("news", function (api) {
    return api.getFilteredByGlob("src/news/*.md")
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });

  // Readable date for news posts
  eleventyConfig.addFilter("niceDate", function (d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric"
    });
  });

  // Split a comma-separated string into a list
  eleventyConfig.addFilter("splitBy", function (str, sep) {
    if (!str) return [];
    return String(str).split(sep || ",").map(s => s.trim()).filter(Boolean);
  });

  // Take the first N items of an array
  eleventyConfig.addFilter("limit", function (arr, n) {
    if (!arr) return [];
    return arr.slice(0, n);
  });

  // Split a textarea into paragraphs on blank lines
  eleventyConfig.addFilter("paragraphs", function (str) {
    if (!str) return [];
    return String(str).split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"]
  };
};
