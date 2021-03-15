const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Set up connection to AWS DynamoDB instance.
const AWS = require("aws-sdk");

// Configure router middleware.
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/", (req, res) => {
  const docClient = new AWS.DynamoDB.DocumentClient();
  const { email, password } = req.body;

  const loginParams = {
    TableName: "Users",
    Key: {
      email: email,
    },
  };

  docClient.get(loginParams, (err, data) => {
    // If returned data obj is empty, email did not match any records in the db.
    if (Object.keys(data).length === 0) {
      console.log("Email not found in database");
      res.sendStatus(404);
    } else {
      bcrypt.compare(password, data.Item.password, (err, same) => {
        if (same) {
          console.log("user authenticated.");
          const payload = { id: data.Item.id };
          const token = jwt.sign(payload, process.env.SECRET_OR_KEY);
          res.status(200).json(token);
        } else {
          console.log("incorrect password");
          res.sendStatus(401);
        }
      });
    }
  });
});

module.exports = router;
