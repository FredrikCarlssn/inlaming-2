const { autoChain, nodeAddress } = require("../utilities/config.js");
const axios = require("axios");

exports.getBlockchain = (req, res) => {
  res.status(200).json(autoChain);
};

exports.mineBlock = async (req, res) => {
  const lastBlock = autoChain.getLastBlock();
  const previousBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: autoChain.pendingTransactions,
    index: lastBlock["index"] + 1,
  };
  const nonce = autoChain.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = autoChain.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );
  const newBlock = autoChain.createNewBlock(
    nonce,
    previousBlockHash,
    blockHash
  );

  autoChain.networkNodes.forEach(async (networkNodeUrl) => {
    await axios.post(`${networkNodeUrl}/api/block`, { block: newBlock });
  });

  autoChain.emptyPendingTransactions(newBlock);

  res.status(200).json({
    note: "New block mined successfully",
    block: newBlock,
  });
};
