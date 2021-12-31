const express = require("express");
const router = express.Router();
const customerController = require("../controller/customer");
const multer = require("multer");
const upload = multer();

router.post("/init", upload.none(), customerController.handle_create_account);

module.exports = router;
