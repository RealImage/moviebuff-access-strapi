"use strict";

// module.exports = ({ strapi }) => {
//   // register phase
// };
module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: "theatre-search-field",
    plugin: "theatre-search", // the custom field is created by a color-picker plugin
    type: "string", // the color will be stored as a string
  });
};
