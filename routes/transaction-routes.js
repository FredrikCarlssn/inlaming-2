const express = require("express");
const router = express.Router();
const {
  addTransaction,
  broadcastTransaction,
  getTransaction,
} = require("../controllers/transaction-controller");

router.route("/:id").get(getTransaction);
router.route("/").post(addTransaction);
router.route("/broadcast").post(broadcastTransaction);

module.exports = router;
