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
  const { email, username, password } = req.body;
  const userID = short.generate();

  const docClient = new AWS.DynamoDB.DocumentClient();

  _registerUser = (params) => {
    docClient.put(params, (err, data) => {
      if (err) {
        console.log("unable to add item. Error: ", err);
        res.sendStatus(500);
      }
      console.log("added item to Users:", data);
      const payload = { email: email };
      const token = jwt.sign(payload, process.env.SECRET_OR_KEY);

      res.status(200).json(token);
    });
  };

  if (username && email && password) {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) throw err;

      const usersParams = {
        TableName: "Users",
        Item: {
          id: userID,
          email: email,
          username: username,
          password: hash,
          pack: {},
        },
      };
      _registerUser(usersParams);
    });
  }

  // do this ^ and then give the user an auth token.
});

module.exports = router;
