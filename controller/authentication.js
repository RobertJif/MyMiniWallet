const _customerService = require("../services/customer");

const authentication_check_token_validation_async = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).send("Invalid Access Token");

  const userAccess = await _customerService.findAccountByToken(token);

  if (userAccess == null) return res.status(401).send("Invalid Access Token");

  req.userData = userAccess.dataValues;
  next();
};

const authentication_check_user_status_async = async (req, res, next) => {
  const token = req.body.token || null;

  const userAccess = await _authorizationService.verify_async(token);

  if (userAccess == null) return res.status(200).send(false);

  return res.status(200).send(true);
};

module.exports = {
  authentication_check_token_validation_async,
  authentication_check_user_status_async,
};
