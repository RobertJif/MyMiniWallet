const Transaction = require("../models/transaction");
const _walletService = require("../services/wallet");
const { transactionEnum } = require("../util/enum");
const sequelize = require("../util/database");
const findByRefId = async (refId) => {
  return await Transaction.findOne({ where: { refId } });
};

const handleDeposit = async (customerId, amount, refId) => {
  const t = await sequelize.transaction();

  try {
    const wallet = await _walletService.findByCustomerId(customerId, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const transaction = await Transaction.create(
      {
        type: transactionEnum.TRANSACTION_TYPE.DEPOSIT,
        status: transactionEnum.TRANSACTION_STATUS.SUCCESS,
        amount,
        refId,
        balanceBefore: +wallet.dataValues.balance,
        balanceAfter: +wallet.dataValues.balance + +amount,
        walletId: wallet.dataValues.id,
        createdBy: customerId,
      },
      { transaction: t }
    );
    wallet.balance = +wallet.dataValues.balance + +amount;
    await wallet.save({ transaction: t });
    await t.commit();
    return [transaction, null];
  } catch (error) {
    await t.rollback();
    return [null, error];
  }
};

const handleWithdraw = async (customerId, amount, refId) => {
  const t = await sequelize.transaction();

  try {
    const wallet = await _walletService.findByCustomerId(customerId, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (+wallet.dataValues.balance - +amount <= 0) {
      t.rollback();
      return [null, "Insufficient Balance"];
    }

    const transaction = await Transaction.create(
      {
        type: transactionEnum.TRANSACTION_TYPE.WITHDRAW,
        status: transactionEnum.TRANSACTION_STATUS.SUCCESS,
        amount,
        refId,
        balanceBefore: +wallet.dataValues.balance,
        balanceAfter: +wallet.dataValues.balance - +amount,
        walletId: wallet.dataValues.id,
        createdBy: customerId,
      },
      { transaction: t }
    );
    wallet.balance = +wallet.dataValues.balance - +amount;
    await wallet.save({ transaction: t });
    await t.commit();
    return [transaction, null];
  } catch (error) {
    await t.rollback();
    return [null, "UNEXPECTED ERROR"];
  }
};
module.exports = {
  findByRefId,
  handleDeposit,
  handleWithdraw,
};
