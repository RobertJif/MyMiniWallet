const jwt = require("jsonwebtoken");
require("dotenv").config();

const signAccessToken = (userData) => {
  return jwt.sign({ user: userData }, process.env.JWT_ACCESS_TOKEN_SECRET);
};

const verify_async = async (token) => {
  return await jwt.verify(
    token,
    process.env.JWT_ACCESS_TOKEN_SECRET,
    (error, userData) => {
      return userData;
    }
  );
};

module.exports = {
  signAccessToken,
  verify_async,
};
