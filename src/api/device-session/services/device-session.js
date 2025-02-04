'use strict';

/**
 * device-session service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::device-session.device-session');
