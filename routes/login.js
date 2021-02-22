const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

// Set up connection to AWS DynamoDB instance.
const AWS = require("aws-sdk");
require("dotenv").config();

const config = {
  aws_remote_config: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: "us-east-2",
};

AWS.config.update(config);

// Configure router middleware.
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Define GET and POST actions
router.get("/", (req, res) => {
  AWS.config.update(config);
  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: "Users",
  };

  docClient.scan(params, (err, data) => {
    if (err) {
      console.log(err);
      res.json("could not establish connection to database");
    } else {
      const { Items } = data;

      res.json({ items: Items });
    }
  });
});

router.post("/", (req, res) => {
  res.json("POST request recieved.");
});

module.exports = router;
