const Wallet = require("../models/wallet");
const op = require("sequelize").Op;

const findByCustomerId = async (customerId, options = {}) => {
  return await Wallet.findOne({ where: { customerId }, ...options });
};

const create = async (customer, t = null) => {
  return await Wallet.create(
    {
      customerId: customer.customerId,
    },
    { transaction: t }
  );
};

const update = async (id, model) => {
  return await Wallet.update(model, {
    where: { id },
  });
};

const addBalance = async (wallet, amount, t = null) => {};

module.exports = {
  findByCustomerId,
  create,
  update,
  addBalance,
};
