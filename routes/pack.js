const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const AWS = require("aws-sdk");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json);

// Updates the pack object in the DB.
router.post("/", (req, res) => {
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

// Reads out the pack object from the DB.
router.post("/readonly", (req, res) => {});

// module.exports = router;
