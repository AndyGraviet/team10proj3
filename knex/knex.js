const environment = process.env.ENVIRONMENT || 'development';
const config = require("../knex/knex.js")[environment];
module.export = require('knex')(config);