const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const AWS = require("aws-sdk");

router.use(bodyParser.urlencoded({ extended: true }));

_getPackData = (params) => {
  docClient.get(params, (err, data) => {
    if (err) throw err;
  });
};

_updatePackData = (params) => {};

// Updates the pack object in the DB.
router.post("/", (req, res) => {
  const docClient = new AWS.DynamoDB.DocumentClient();

  const { email, token } = req.body;

  if (token) {
    jwt.verify(token, process.env.SECRET_OR_KEY, (err, valid) => {
      if (err) throw err;

      if (valid) {
        const params = {
          TableName: "Users",
          Key: {
            email: email,
          },
        };

        docClient.get(params, (err, data) => {
          if (err) {
            console.log(err);
            res.status(500).json("could not establish connection to DynamoDB");
          } else {
            const { pack } = data.Item;
            res.status(200).json(pack);
          }
        });
      }
    });
  } else {
    res.sendStatus(401);
  }
});

router.get("/:id", (req, res) => {
  const docClient = new AWS.DynamoDB.DocumentClient();

  const id = req.params.id;

  const params = {
    TableName: "Users",
    Key: {
      id: id,
    },
  };
});

module.exports = router;
