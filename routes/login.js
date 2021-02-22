const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post("/", (req, res) => {
  console.log("request recieved:");
  console.log(`
  :::::::
      
  ${req}
  
  ::::::`);
  res.status(200).json("Made it in buddy!");
});
