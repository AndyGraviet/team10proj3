const environment = process.env.ENVIRONMENT || 'development';
const config = require("../knexfile.js")[environment];
module.export = require('knex')(config);