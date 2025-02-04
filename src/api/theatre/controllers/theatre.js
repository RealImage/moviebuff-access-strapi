"use strict";

/**
 * theatre controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::theatre.theatre");
// module.exports = createCoreController("api::theatre.theatre", ({ strapi }) => ({
//   async countWithCondition(ctx) {
//     const { where } = ctx.query;

//     // Parse the where condition if it's passed as a JSON string
//     const parsedWhere = where ? JSON.parse(where) : {};

//     // Count the records with the specified condition
//     const count = await strapi.db
//       .query("api::theatre.theatre")
//       .count({ where: parsedWhere });

//     return ctx.send({ count });
//   },
// }));
