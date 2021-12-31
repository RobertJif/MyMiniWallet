envVariables = require("dotenv").config({
  path: `./.env.${process.env.NODE_ENV?.toLowerCase()}`,
}).parsed;
const envConfig = Object.freeze({
  NODE_ENV: envVariables.NODE_ENV,
  DB_HOST: envVariables.DB_HOST,
  DB_NAME: envVariables.DB_NAME,
  DB_USER: envVariables.DB_USER,
  DB_PASS: envVariables.DB_PASS,
  JWT_ACCESS_TOKEN_SECRET: envVariables.JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET: envVariables.JWT_REFRESH_TOKEN_SECRET,
});

module.exports = envConfig;
