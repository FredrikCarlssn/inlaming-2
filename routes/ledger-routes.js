const express = require("express");
const router = express.Router();
const { createPerson } = require("../controllers/ledger-controller.js");

router.route("/create-person").post(createPerson);

module.exports = router;
