const Sequelize = require("sequelize").Sequelize;
const envConfig = require("./environment");
const sequelize = new Sequelize(
  envConfig.DB_NAME,
  envConfig.DB_USER,
  envConfig.DB_PASS,
  {
    dialect: "postgres",
    host: envConfig.DB_HOST,
    logging: false,
  }
);

module.exports = sequelize;
