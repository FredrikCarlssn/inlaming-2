const { autoChain } = require("../utilities/config.js");
const axios = require("axios");

exports.synchronize = (req, res) => {
  const currentChainLength = autoChain.chain.length;
  let maxLength = currentChainLength;
  let longestChain = autoChain.chain;
  let pendingList = autoChain.pendingTransactions;
  autoChain.networkNodes.map(async (networkNodeUrl) => {
    axios.get(`${networkNodeUrl}/api/v1/blockchain`).then((response) => {
      if (
        response.data.chain.length > maxLength &&
        autoChain.chainIsValid(response.data.data.chain)
      ) {
        maxLength = response.data.chain.length;
        longestChain = response.data.chain;
        pendingList = response.data.pendingTransactions;
      }
    });
  });
  autoChain.chain = longestChain;
  autoChain.pendingTransactions = pendingList;
  res.status(200).json({ success: true, data: longestChain });
};
