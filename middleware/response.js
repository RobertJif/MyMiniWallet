const responseMiddleware = (req, res, next) => {
  let oldSend = res.send;
  res.send = function (data) {
    res.send = oldSend;
    return res.send({
      status:
        res.statusCode?.toString()?.charAt(0) === "2" ? "success" : "fail",
      data: data,
    });
  };
  next();
};

module.exports = responseMiddleware;
