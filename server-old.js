const express = require("express");
const { v4: uuidv4 } = require("uuid");
const fetch = require("node-fetch");
const axios = require("axios");

const Blockchain = require("./models/blockchain");
const nodeAddress = uuidv4().split("-").join("");
const app = express();

const youCoin = new Blockchain();

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).json(youCoin);
});

app.post("/api/transaction", (req, res) => {
  const transaction = req.body;
  const index = youCoin.addTransactionToPendingTransactions(transaction);

  res.status(200).json({ success: true, data: index });
});

app.post("/api/transaction/broadcast", (req, res) => {
  const { amount, sender, recipient } = req.body;
  const transaction = youCoin.createNewTransaction(amount, sender, recipient);

  youCoin.addTransactionToPendingTransactions(transaction);

  youCoin.networkNodes.forEach(async (networkNodeUrl) => {
    await axios.post(`${networkNodeUrl}/api/transaction`, transaction);
  });

  res.status(200).json({ success: true, data: transaction });
});

app.post("/api/block", (req, res) => {
  const block = req.body.block;
  lastBlock = youCoin.getLastBlock();
  const correctHash = lastBlock.hash === block.previousBlockHash;
  const hasCorrectIndex = lastBlock.index + 1 === block.index;

  if (correctHash && hasCorrectIndex) {
    youCoin.chain.push(block);
    youCoin.newTransactions = [];
    res.status(201).json({ success: true, data: block });
  } else {
    res
      .status(400)
      .json({ success: false, errorMessage: "Invalid block", data: block });
  }
});

app.get("/api/mine", async (req, res) => {
  const lastBlock = youCoin.getLastBlock();
  const previousBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: youCoin.pendingTransactions,
    index: lastBlock["index"] + 1,
  };
  const nonce = youCoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = youCoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );
  console.log(currentBlockData);
  const newBlock = youCoin.createNewBlock(nonce, previousBlockHash, blockHash);

  youCoin.networkNodes.forEach(async (networkNodeUrl) => {
    await axios.post(`${networkNodeUrl}/api/block`, { block: newBlock });
  });

  await axios.post(`${youCoin.nodeUrl}/api/transaction/broadcast`, {
    amount: 6.25,
    sender: "00",
    recipient: nodeAddress,
  });

  res.status(200).json({
    note: "New block mined successfully",
    block: newBlock,
  });
});

app.post("/api/register-nodes", (req, res) => {
  const nodes = req.body.nodes;
  nodes.forEach((node) => {
    if (!youCoin.networkNodes.includes(node) && node !== youCoin.nodeUrl)
      youCoin.networkNodes.push(node);
  });

  res.status(200).json({
    note: "New nodes have been added",
    nodes: nodes,
  });
});

app.post("/api/register-node", (req, res) => {
  const url = req.body.nodeUrl;

  if (!youCoin.networkNodes.includes(url) && url !== youCoin.nodeUrl) {
    youCoin.networkNodes.push(url);
  }
  res.status(201).json({ success: true, data: url });
});

app.post("/api/register-broadcast-node", async (req, res) => {
  const url = req.body.nodeUrl;

  if (!youCoin.networkNodes.includes(url)) {
    youCoin.networkNodes.push(url);
  }

  youCoin.networkNodes.forEach(async (networkNodeUrl) => {
    await axios.post(`${networkNodeUrl}/api/register-node`, { nodeUrl: url });
  });

  const allNodes = { nodes: [...youCoin.networkNodes, youCoin.nodeUrl] };

  await axios.post(`${url}/api/register-nodes`, allNodes);

  res.status(201).json({ success: true, data: url });
});

app.get("/api/validation", async (req, res) => {
  let result = await youCoin.chainIsValid(youCoin.chain);
  console.log(result);
  res.status(200).json({ success: true, data: result });
});

app.get("/api/consensus", async (req, res) => {
  const currentChainLength = youCoin.chain.length;
  let maxLength = currentChainLength;
  let longestChain = youCoin.chain;
  let pendingList = youCoin.pendingTransactions;

  youCoin.networkNodes.forEach(async (networkNodeUrl) => {
    axios.get(`${networkNodeUrl}/api`).then((response) => {
      if (
        response.data.data.chain.length > maxLength &&
        youCoin.chainIsValid(response.data.data.chain)
      ) {
        maxLength = response.data.data.chain.length;
        longestChain = response.data.data.chain;
        pendingList = response.data.data.pendingTransactions;
      }
    });
  });
  youCoin.chain = longestChain;
  youCoin.pendingTransactions = pendingList;
});

app.get("/api/block/:blockHash", (req, res) => {
  const blockHash = req.params.blockHash;
  let block = null;
  if ((block = youCoin.findBlock(blockHash)))
    res.status(200).json({ success: true, data: block });
  else
    res.status(404).json({ success: false, errorMessage: "Block not found" });
});

app.get("/api/transaction/:transactionId", (req, res) => {
  const transactionId = req.params.transactionId;
  const { block, transaction } = youCoin.findTransaction(transactionId);
  if (transaction && block)
    res.status(200).json({ success: true, data: { block, transaction } });
  else
    res
      .status(404)
      .json({ success: false, errorMessage: "Transaction not found" });
});

app.get("/api/address/:address", (req, res) => {
  const address = req.params.address;
  const transactions = youCoin.listTransactions(address);
  res.status(200).json({ success: true, data: transactions });
});

app.get("/api/funds/:adress", (req, res) => {
  const address = req.params.adress;
  const balance = youCoin.listTransactions(address).balance;
  res.status(200).json({ success: true, balance: balance });
});

app.listen(process.argv[2], () => {
  console.log(`Server is listening on port ${process.argv[2]}`);
});
