const { autoChain } = require("../utilities/config.js");

exports.listTransactions = (req, res) => {
  const address = req.params.address;
  const transactions = autoChain.listTransactions(address);
  res.status(200).json({ success: true, data: transactions });
};
