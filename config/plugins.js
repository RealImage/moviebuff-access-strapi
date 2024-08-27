module.exports = {
  "custom-dashboard": {
    enabled: true,
    resolve: "./src/plugins/custom-dashboard",
    appUrl: process.env.STRAPI_API_URL,
    appApiKey: `Bearer ${process.env.STRAPI_API_TOKEN}`,
  },
  "theatre-search": {
    enabled: true,
    resolve: "./src/plugins/theatre-search",
  },
  "location-plugin": {
    enabled: true,
  }
};
