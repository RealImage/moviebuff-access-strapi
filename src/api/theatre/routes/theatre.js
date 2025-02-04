"use strict";
const { createCoreRouter } = require("@strapi/strapi").factories;
module.exports = createCoreRouter("api::theatre.theatre");

// const { createCoreRouter } = require("@strapi/strapi").factories;

// const defaultRoutes = createCoreRouter("api::theatre.theatre");

// const customRoutes = [
//   {
//     method: "GET",
//     path: "/theatre/count-with-condition",
//     handler: "theatre.countWithCondition",
//     config: {
//       auth: false, // Adjust this according to your needs
//     },
//   },
// ];

// module.exports = {
//   ...defaultRoutes,
//   routes: [...defaultRoutes.routes, ...customRoutes],
// };
