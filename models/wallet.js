const Sequelize = require("sequelize");
const { walletEnum } = require("../util/enum");
const sequelize = require("../util/database");
const Transaction = require("./transaction");
const Customer = require("./customer");
const Wallet = sequelize.define("wallet", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  status: {
    type: Sequelize.ENUM,
    values: Object.values(walletEnum.WALLET_STATUS),
    defaultValue: walletEnum.WALLET_STATUS.INACTIVE,
    allowNull: false,
  },
  balance: {
    type: Sequelize.DECIMAL(20, 2),
    defaultValue: 0,
    allowNull: false,
  },
  customerId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
});

module.exports = Wallet;
