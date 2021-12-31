const Sequelize = require("sequelize");
const { transactionEnum } = require("../util/enum");
const sequelize = require("../util/database");
const Wallet = require("./wallet");
const Transaction = sequelize.define("transaction", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  type: {
    type: Sequelize.ENUM,
    values: Object.values(transactionEnum.TRANSACTION_TYPE),
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM,
    values: Object.values(transactionEnum.TRANSACTION_STATUS),
    allowNull: false,
  },
  amount: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  balanceBefore: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  balanceAfter: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false,
  },
  walletId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  refId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  createdBy: {
    type: Sequelize.UUID,
    allowNull: false,
  },
});

module.exports = Transaction;
