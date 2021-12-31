const Customer = require("../models/customer");
const _walletService = require("../services/wallet");
const sequelize = require("../util/database");
const authorization = require("../util/authorization");

const findAccountByToken = async (token) => {
  const customer = await Customer.findOne({
    where: {
      token,
    },
  });

  return customer;
};
const initializeAccount = async (customerId) => {
  const existingCustomer = await Customer.findOne({
    where: { customerId },
  });
  console.log(existingCustomer?.dataValues);
  if (existingCustomer)
    return [existingCustomer.dataValues.token.toString(), null];
  const t = await sequelize.transaction();

  try {
    const accessToken = authorization.signAccessToken(customerId);
    const customer = await Customer.create(
      {
        customerId: customerId,
        token: accessToken,
      },
      { transaction: t }
    );
    const wallet = await _walletService.create(customer.dataValues, t);
    await t.commit();
    return [accessToken, null];
  } catch (error) {
    await t.rollback();
    return [null, error];
  }
};

module.exports = {
  findAccountByToken,
  initializeAccount,
};
