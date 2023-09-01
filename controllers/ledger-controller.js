const { autoChain } = require("../utilities/config.js");
const Keys = require("../models/keyGenerator.js");

exports.createPerson = (req, res) => {
  const { name } = req.body;
  const keys = new Keys();
  const publicKey = keys.formatPublicKey();
  const transaction = { type: "newPerson", details: { name, publicKey } };
  autoChain.addTransactionToPendingTransactions(transaction);
  res.status(201).json({ success: true, data: { name, keys } });
};

exports.createCar = (req, res) => {
  const { vin, make, model, year, owner } = req.body;
  const transaction = {
    type: "newCar",
    details: { vin, make, model, year, owner },
  };
  autoChain.addTransactionToPendingTransactions(transaction);
  res.status(201).json({ success: true, data: { vin, make, model, year } });
};

exports.createDealership = (req, res) => {
  const { name, location } = req.body;
  const keys = new Keys();
  const publicKey = keys.formatPublicKey();
  const transaction = {
    type: "newDealership",
    details: { name, location, publicKey },
    encryptedTransaction,
  };
  autoChain.addTransactionToPendingTransactions(transaction);
};

exports.changeCarOwner = (req, res) => {
  const { vin, owner, newOwner, encryptedTransaction } = req.body;
  const keys = new Keys({ publicKey: owner });
  if (vin + newOwner === keys.decryptWithPublicKey(encryptedTransaction)) {
    autoChain.addTransactionToPendingTransactions(transaction);
  }
};

exports.addCarService = (req, res) => {
  const { vin, service, owner, encryptedTransaction } = req.body;
  const keys = new Keys({ publicKey: owner });
  const transaction = {
    type: "newService",
    details: { vin, service, publicKey: owner },
    encryptedTransaction,
  };

  if (vin + service === keys.decryptWithPublicKey(encryptedTransaction)) {
    transaction = {};
    autoChain.addTransactionToPendingTransactions(transaction);
  }
};
