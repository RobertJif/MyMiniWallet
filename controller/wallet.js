const _encryptionService = require("../util/encryption");
const _walletService = require("../services/wallet");
const _transactionService = require("../services/transaction");
const _authorizationService = require("../util/authorization");
const { walletEnum } = require("../util/enum");
const handle_enable_wallet_async = async (req, res, next) => {
  const wallet = await _walletService.findByCustomerId(req.userData.customerId);
  if (!wallet) return res.status(404).send({ error: "Wallet not found" });

  if (wallet.dataValues.status === walletEnum.WALLET_STATUS.ACTIVE)
    return res.status(400).send({ error: "Already enabled" });

  wallet.status = walletEnum.WALLET_STATUS.ACTIVE;
  wallet.save();
  return res.status(201).send({
    wallet: {
      id: wallet.dataValues.id,
      owned_by: wallet.dataValues.customerId,
      status: wallet.dataValues.status,
      enabled_at: wallet.dataValues.updatedAt,
      balance: +wallet.dataValues.balance,
    },
  });
};

const handle_find_balance_async = async (req, res, next) => {
  const wallet = await _walletService.findByCustomerId(req.userData.customerId);

  if (!wallet) return res.status(404).send({ error: "Wallet not found" });
  if (wallet.dataValues.status !== walletEnum.WALLET_STATUS.ACTIVE)
    return res.status(400).send({ error: "Disabled" });

  return res.status(200).send({
    wallet: {
      id: wallet.dataValues.id,
      owned_by: wallet.dataValues.customerId,
      status: wallet.dataValues.status,
      enabled_at: wallet.dataValues.updatedAt,
      balance: +wallet.dataValues.balance,
    },
  });
};

const handle_deposit_async = async (req, res, next) => {
  const wallet = await _walletService.findByCustomerId(req.userData.customerId);

  if (!wallet) return res.status(404).send({ error: "Wallet not found" });
  if (wallet.dataValues.status !== walletEnum.WALLET_STATUS.ACTIVE)
    return res.status(404).send({ error: "Disabled" });
  let transaction = await _transactionService.findByRefId(
    req.body?.reference_id
  );
  if (transaction) return res.status(400).send({ error: "Duplicate Ref Id" });
  let [newTransaction, error] = await _transactionService.handleDeposit(
    req.userData.customerId,
    req.body?.amount,
    req.body?.reference_id
  );
  if (error) return res.status(500).send({ error: "UNEXPECTED ERROR" });
  transaction = newTransaction;

  return res.status(201).send({
    deposit: {
      id: transaction.dataValues.id,
      deposited_by: transaction.dataValues.createdBy,
      status: transaction.dataValues.status,
      deposited_at: transaction.dataValues.createdAt,
      amount: +transaction.dataValues.amount,
      reference_id: transaction.dataValues.refId,
    },
  });
};

const handle_withdraw_async = async (req, res, next) => {
  const wallet = await _walletService.findByCustomerId(req.userData.customerId);

  if (!wallet) return res.status(404).send({ error: "Wallet not found" });
  if (wallet.dataValues.status !== walletEnum.WALLET_STATUS.ACTIVE)
    return res.status(404).send({ error: "Disabled" });

  let transaction = await _transactionService.findByRefId(
    req.body?.reference_id
  );
  if (transaction) return res.status(400).send({ error: "Duplicate Ref Id" });

  let [newTransaction, error] = await _transactionService.handleWithdraw(
    req.userData.customerId,
    req.body?.amount,
    req.body?.reference_id
  );
  if (error) return res.status(400).send({ error });
  transaction = newTransaction;

  return res.status(201).send({
    deposit: {
      id: transaction.dataValues.id,
      withdrawn_by: transaction.dataValues.createdBy,
      status: transaction.dataValues.status,
      withdrawn_at: transaction.dataValues.created,
      amount: +transaction.dataValues.amount,
      reference_id: transaction.dataValues.refId,
    },
  });
};

const handle_disable_wallet_async = async (req, res, next) => {
  const wallet = await _walletService.findByCustomerId(req.userData.customerId);
  if (!req.body?.is_disabled)
    return res
      .status(400)
      .send({ error: { is_disabled: "Missing data for required field." } });
  if (!wallet) return res.status(404).send({ error: "Wallet not found" });

  const newStatus = req.body?.is_disabled
    ? walletEnum.WALLET_STATUS.INACTIVE
    : walletEnum.WALLET_STATUS.ACTIVE;
  if (wallet.dataValues.status === newStatus)
    return res.status(400).send({ error: `Already ${newStatus}` });

  wallet.status = walletEnum.WALLET_STATUS.INACTIVE;
  await wallet.save();
  return res.status(200).send({
    wallet: {
      id: wallet.dataValues.id,
      owned_by: wallet.dataValues.customerId,
      status: wallet.dataValues.status,
      disabled_at: wallet.dataValues.updatedAt,
      balance: +wallet.dataValues.balance,
    },
  });
};

module.exports = {
  handle_find_balance_async,
  handle_deposit_async,
  handle_withdraw_async,
  handle_disable_wallet_async,
  handle_enable_wallet_async,
};
