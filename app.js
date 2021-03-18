"use strict";

// eslint-disable-next-line import/no-unresolved
const express = require("express");
const login = require("./routes/login");
const register = require("./routes/register");
const pack = require("./routes/pack");
const bodyParser = require("body-parser");
const cors = require('cors');

// Set up connection to AWS DynamoDB
const AWS = require("aws-sdk");
const config = require("./_config");
AWS.config.update(config);

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/login", login);
app.use("/register", register);
app.use("/pack", pack);

app.get("/", function (req, res) {
  res.send(" /GET 200 OK");
  res.end();
});

// Local development only.
app.listen(8080, () => {
  console.log("server running successfully");
});

// Error handler
module.exports = app;
