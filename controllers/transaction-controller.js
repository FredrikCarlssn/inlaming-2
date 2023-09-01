const { autoChain, createId } = require("../utilities/config.js");

exports.addTransaction = (req, res) => {
  const transaction = req.body;
  const index = autoChain.addTransactionToPendingTransactions(transaction);

  res.status(200).json({ success: true, data: index });
};

exports.broadcastTransaction = (req, res) => {
  let transaction = req.body;
  transaction.transactionId = createId();

  autoChain.addTransactionToPendingTransactions(transaction);

  autoChain.networkNodes.forEach(async (networkNodeUrl) => {
    await axios.post(`${networkNodeUrl}/api/v1/transaction`, transaction);
  });

  res.status(200).json({ success: true, data: transaction });
};

exports.getTransaction = (req, res) => {
  const transactionId = req.params.transactionId;
  const { block, transaction } = autoChain.findTransaction(transactionId);
  if (transaction && block)
    res.status(200).json({ success: true, data: { block, transaction } });
  else
    res
      .status(404)
      .json({ success: false, errorMessage: "Transaction not found" });
};
