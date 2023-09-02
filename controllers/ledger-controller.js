const { autoChain } = require("../utilities/config.js");
const Keys = require("../models/keyGenerator.js");

exports.createPerson = (req, res) => {
  let { name, publicKey } = req.body;
  let keys;
  if (!publicKey) {
    keys = new Keys();
    publicKey = keys.formatPublicKey();
  }
  const transaction = {
    transactionType: "newPerson",
    details: { name, publicKey },
  };
  autoChain.addTransactionToPendingTransactions(transaction);
  res.status(201).json({ success: true, data: { name, publicKey } });
};

exports.createCar = (req, res) => {
  const { vin, make, model, year, owner } = req.body;
  const transaction = {
    transactionType: "newCar",
    details: { vin, make, model, year, owner },
  };
  autoChain.addTransactionToPendingTransactions(transaction);
  res
    .status(201)
    .json({ success: true, data: { vin, make, model, year, owner } });
};

exports.createDealership = (req, res) => {
  const { name, location } = req.body;
  const keys = new Keys();
  const publicKey = keys.formatPublicKey();
  const transaction = {
    transactionType: "newDealership",
    details: { name, location, publicKey },
  };
  autoChain.addTransactionToPendingTransactions(transaction);
  res.status(201).json({ success: true, data: { name, location, publicKey } });
};
//  ------------------      INTE KLAR ------------------//
// exports.changeCarOwner = (req, res) => {
//   const { vin, owner, newOwner, encryptedTransaction } = req.body;
//   const keys = new Keys({ publicKey: owner });
//   const transaction = {
//     transactionType: "newOwner",
//     details: { vin, owner: newOwner },
//     encryptedTransaction,
//   };
//   if (vin + newOwner === keys.decryptWithPublicKey(encryptedTransaction)) {
//     autoChain.addTransactionToPendingTransactions(transaction);
//   }
//   res
//     .status(201)
//     .json({ success: true, data: { encryptedTransaction, newOwner, vin } });
// };

// exports.addCarService = (req, res) => {
//   const { vin, service, owner, privateKey } = req.body;
//   const keys = new Keys({ privateKey, publicKey: owner });
//   console.log(keys.privateKey.toString());
//   const encryptedTransaction = keys.encryptWithPrivateKey(vin + service);
//   const transaction = {
//     transactionType: "newService",
//     details: { vin, service, publicKey: owner },
//     encryptedTransaction,
//   };

//   if (vin + service === keys.decryptWithPublicKey(encryptedTransaction)) {
//     transaction = {};
//     autoChain.addTransactionToPendingTransactions(transaction);
//   }
//   res
//     .status(201)
//     .json({ success: true, data: { encryptedTransaction, newOwner, vin } });
// };
