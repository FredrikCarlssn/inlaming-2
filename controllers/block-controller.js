const { autoChain } = require("../utilities/config.js");

exports.addBlock = (req, res) => {
  const block = req.body.block;
  lastBlock = autoChain.getLastBlock();
  const correctHash = lastBlock.hash === block.previousBlockHash;
  const hasCorrectIndex = lastBlock.index + 1 === block.index;
  if (correctHash && hasCorrectIndex) {
    autoChain.chain.push(block);
    autoChain.emptyPendingTransactions(block);
    res.status(201).json({ success: true, data: block });
  } else {
    res
      .status(400)
      .json({ success: false, errorMessage: "Invalid block", data: block });
  }
};

exports.findBlock = (req, res) => {
  const blockHash = req.params.blockHash;
  let block = null;
  if ((block = autoChain.findBlock(blockHash)))
    res.status(200).json({ success: true, data: block });
  else
    res.status(404).json({ success: false, errorMessage: "Block not found" });
};
