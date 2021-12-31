const Sequelize = require("sequelize");

const sequalize = require("../util/database");
const Wallet = require("./wallet");

const Customer = sequalize.define("customer", {
  customerId: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
  },
  token: {
    type: Sequelize.STRING(60, true),
    allowNull: false,
  },
});
module.exports = Customer;
