const express = require("express");
const router = express.Router();
const {
  createPerson,
  createCar,
  createDealership,
  //   changeCarOwner,
  //   addCarService,
} = require("../controllers/ledger-controller.js");

router.route("/create-person").post(createPerson);
router.route("/create-car").post(createCar);
router.route("/create-dealership").post(createDealership);
// router.route("/change-car-owner").post(changeCarOwner);
// router.route("/add-car-service").post(addCarService);

module.exports = router;
