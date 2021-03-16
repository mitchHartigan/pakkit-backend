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

  const { email, token, packData } = req.body;

  // Verify the token is valid, then look up the user in the Users table.
  // Go over to the Packs table and update the pack value using the user id.
  if (token) {
    jwt.verify(token, process.env.SECRET_OR_KEY, (err, valid) => {
      if (err) throw err;

      if (valid) {
        const usersParams = {
          TableName: "Users",
          Key: {
            email: email,
          },
        };

        docClient.get(usersParams, (err, data) => {
          if (err) throw err;

          // UpdateExpression needs to use a new variable? Idk exactly
          // what the set pack=:p does tbh, just following the AWS docs.
          const packsParams = {
            TableName: "Packs",
            Key: {
              id: data.Item.id,
            },
            UpdateExpression: "set pack=:p",
            ExpressionAttributeValues: {
              ":p": packData,
            },
            ReturnValues: "UPDATED_NEW",
          };

          // update the pack data.
          docClient.update(packsParams, (err, data) => {
            if (err) throw err;

            if (data) {
              res.sendStatus(200);
            }
          });
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
    TableName: "Packs",
    Key: {
      id: id,
    },
  };

  docClient.get(params, (err, data) => {
    if (err) {
      console.log("could not find requested pack");
      res.sendStatus(404);
    }

    if (data) {
      const pack = data.Item.pack;
      res.json(pack);
    }
  });
});

module.exports = router;
