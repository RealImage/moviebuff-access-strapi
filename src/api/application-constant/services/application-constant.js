'use strict';

/**
 * application-constant service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::application-constant.application-constant');
