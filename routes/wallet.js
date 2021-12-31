const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const {
  authentication_check_token_validation_async,
} = require("../controller/authentication");
const walletController = require("../controller/wallet");

router.post(
  "/",
  authentication_check_token_validation_async,
  walletController.handle_enable_wallet_async
);

router.get(
  "/",
  authentication_check_token_validation_async,
  walletController.handle_find_balance_async
);

router.post(
  "/deposits",
  upload.none(),
  authentication_check_token_validation_async,
  walletController.handle_deposit_async
);

router.post(
  "/withdrawals",
  upload.none(),
  authentication_check_token_validation_async,
  walletController.handle_withdraw_async
);

router.patch(
  "/",
  upload.none(),
  authentication_check_token_validation_async,
  walletController.handle_disable_wallet_async
);

module.exports = router;
