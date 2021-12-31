const _customerService = require("../services/customer");

const handle_create_account = async (req, res, next) => {
  customerId = req.body?.customer_xid;

  if (!customerId)
    return res
      .status(400)
      .send({ error: { customer_xid: "Missing data for required field." } });

  const [accessToken, error] = await _customerService.initializeAccount(
    customerId
  );
  if (error) return res.status(500).send({ error: "UNEXPECTED ERROR" });
  return res.status(201).send({
    token: accessToken,
  });
};

module.exports = {
  handle_create_account,
};
