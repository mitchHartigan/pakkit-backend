"use strict";

// eslint-disable-next-line import/no-unresolved
const express = require("express");
const login = require("./routes/login");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/login", login);

app.get("/", function (req, res) {
  res.send(" /GET 200 OK");
  res.end();
});

app.listen(8080, () => {
  console.log("server running successfully");
});

// Error handler
module.exports = app;
