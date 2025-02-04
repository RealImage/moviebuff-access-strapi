'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('custom-dashboard')
      .service('myService')
      .getWelcomeMessage();
  },
});
