// app.js
const express = require("express");
const { Sequelize } = require("sequelize");
const { dbConnection } = require("./connection");

const app = express();
const port = 3000;

const sequelize = new Sequelize("tablinks", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: console.log,
});

Object.values(sequelize.models).forEach((model) => {
  console.log(model.name);
});

app.use(express.json());
dbConnection(sequelize);

app.use("/user", require("./routes/userManagement")(sequelize));
app.use("/login", require("./routes/login")(sequelize));
app.use("/category", require("./routes/category")(sequelize));
app.use("/product", require("./routes/product")(sequelize));
app.use("/vendor", require("./routes/vendor")(sequelize));
app.use("/customer", require("./routes/customer")(sequelize));
app.use("/stock-recieving", require("./routes/stockReceiving")(sequelize));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
