const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const walletRoutes = require("./routes/wallet");
const customerRoutes = require("./routes/customer");
const responseMiddleware = require("./middleware/response");

const v1_path = "/api/v1";

app.use(responseMiddleware);
app.use(`${v1_path}/`, customerRoutes);
app.use(`${v1_path}/wallet`, walletRoutes);

sequelize
  // .authenticate()
  .sync({ force: false })
  .then((response) => {
    app.listen(port);
    console.log("Server is running on localhost:" + port);
  })
  .catch((error) => {
    console.log(error);
  });
