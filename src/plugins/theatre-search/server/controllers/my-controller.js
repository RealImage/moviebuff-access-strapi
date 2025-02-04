'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('theatre-search')
      .service('myService')
      .getWelcomeMessage();
  },
});
