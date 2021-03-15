const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const short = require("short-uuid");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");

// Configure router middleware.
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Define POST actions
router.post("/", (req, res) => {
  const { email, name, password } = req.body;
  const userID = short.generate();

  _registerUser = (usersParams, packsParams) => {
    const docClient = new AWS.DynamoDB.DocumentClient();

    docClient.put(usersParams, (err, data) => {
      if (err) throw err;
    });

    docClient.put(packsParams, (err, data) => {
      if (err) throw err;
    });

    console.log("user added successfully");

    const payload = { id: usersParams.id };
    const token = jwt.sign(payload, process.env.SECRET_OR_KEY);
    res.json(token);
  };

  if (name && email && password) {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) throw err;

      const usersParams = {
        TableName: "Users",
        Item: {
          id: userID,
          email: email,
          name: name,
          password: hash,
        },
      };

      const packsParams = {
        TableName: "Packs",
        Item: {
          id: userID,
          pack: {},
        },
      };

      _registerUser(usersParams, packsParams);
    });
  }
  // do this ^ and then give the user an auth token.
});

module.exports = router;
