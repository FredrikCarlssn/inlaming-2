const { autoChain } = require("../utilities/config.js");

exports.synchronize = (req, res) => {
  const currentChainLength = autoChain.chain.length;
  let maxLength = currentChainLength;
  let longestChain = autoChain.chain;
  let pendingList = autoChain.pendingTransactions;

  autoChain.networkNodes.forEach(async (networkNodeUrl) => {
    axios.get(`${networkNodeUrl}/api`).then((response) => {
      if (
        response.data.data.chain.length > maxLength &&
        autoChain.chainIsValid(response.data.data.chain)
      ) {
        maxLength = response.data.data.chain.length;
        longestChain = response.data.data.chain;
        pendingList = response.data.data.pendingTransactions;
      }
    });
  });
  autoChain.chain = longestChain;
  autoChain.pendingTransactions = pendingList;
};
