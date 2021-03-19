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
router.use(bodyParser.json());

router.post("/", (req, res) => {
  const docClient = new AWS.DynamoDB.DocumentClient();
  const { email, password } = req.body;

  if (email && password) {
    const loginParams = {
      TableName: "Users",
      Key: {
        email: email,
      },
    };
    // Check the database to see if the user email is in there.
    docClient.get(loginParams, (err, data) => {
      // If returned data obj is empty, email did not match any records in the db.
      if (Object.keys(data).length === 0) {
        res
          .status(404)
          .json({ token: "", message: "Email not found in database." });
      } else {
        // hash the input password, and check it with the one returned from the db.
        bcrypt.compare(password, data.Item.password, (err, same) => {
          if (same) {
            const payload = { id: data.Item.id };
            const token = jwt.sign(payload, process.env.SECRET_OR_KEY);
            res.status(200).json({ token: token, message: "" });
          } else {
            res
              .status(401)
              .json({ token: "", message: "Password is incorrect." });
          }
        });
      }
    });
  } else {
    res
      .status(400)
      .json({ token: "", message: "Email or password are empty." });
  }
});

module.exports = router;
