const express = require("express");
const cors = require("cors");
const blockchain = require("./routes/blockchain-routes");
const block = require("./routes/block-routes");
const transaction = require("./routes/transaction-routes");
const transactions = require("./routes/transactions-routes");
const node = require("./routes/node-routes");
const consensus = require("./routes/consensus-routes");
const ledger = require("./routes/ledger-routes");

const app = express();
const PORT = process.argv[2];
console.log(PORT);

const Blockchain = require("./models/blockchain");

app.use(express.json());
app.use(cors());

app.use("/api/v1/blockchain", blockchain);
app.use("/api/v1/block", block);
app.use("/api/v1/transaction", transaction);
app.use("/api/v1/transactions", transactions);
app.use("/api/v1/node", node);
app.use("/api/v1/consensus", consensus);
app.use("/api/v1/ledger", ledger);

app.listen(process.argv[2], () => {
  console.log(`Server is listening on port ${PORT}`);
});
