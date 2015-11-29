/**
 * Export Service Collection Object
 * @param config Configuration Object
 * @returns {{
 *   mysql: (mysqlService)
 *   elasticSearch: (ElasticSearchService),
 *   ses: (SimpleEmailService)
 * }}
 */
module.exports = function () {
    'use strict';

    var mysqlService = require('./mysql');

    return {
        "mysql": mysqlService
    };
};