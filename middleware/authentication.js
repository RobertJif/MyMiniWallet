const express = require('express')
const router = express.Router()
const authenticationController = require('../controller/authentication')

router.use('/', authenticationController.authentication_check_token_validation_async)

module.exports = router;