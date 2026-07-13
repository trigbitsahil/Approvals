// lingui.config.js
module.exports = {
  locales: ["en", "hi", "de"],
  sourceLocale: "en",
  format: "po",
  catalogs: [
    {
      path: "src/locales/{locale}/messages",
      include: ["src"],
    },
  ],
};
