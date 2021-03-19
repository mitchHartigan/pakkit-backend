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

_registerUser = (usersParams, packsParams, res) => {
  const docClient = new AWS.DynamoDB.DocumentClient();

  // Put user in database.
  docClient.put(usersParams, (err, data) => {
    if (err) throw err;
  });

  // Put empty pack in database.
  docClient.put(packsParams, (err, data) => {
    if (err) throw err;
  });

  // Log out that a new user has been added.
  console.log(`User ${usersParams.email} added successfully to database.`);

  // Sign the jwt token with the new short uuid.
  const payload = { id: usersParams.id };
  const token = jwt.sign(payload, process.env.SECRET_OR_KEY);

  // Send the token back with no error message.
  res.status(200).json({ token: token, message: "" });
};

// Define POST actions
router.post("/", (req, res) => {
  const { email, password } = req.body;
  const userID = short.generate();

  if (email && password) {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) throw err;

      const usersParams = {
        TableName: "Users",
        Item: {
          id: userID,
          email: email,
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

      _registerUser(usersParams, packsParams, res);
    });
  }
});

module.exports = router;
