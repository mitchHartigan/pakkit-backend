"use strict";

// eslint-disable-next-line import/no-unresolved
const express = require("express");
const login = require("./routes/login");

const app = express();

app.use("/login", login);

// Error handler
app.use((err, req, res) => {
  console.error(err);
  res.status(500).send("Internal Serverless Error");
});

module.exports = app;
