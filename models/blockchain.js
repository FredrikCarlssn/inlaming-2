const sha256 = require("sha256");
const { v4: uuidv4 } = require("uuid");
const Keys = require("./keyGenerator.js");

class Blockchain {
  constructor() {
    this.chain = [
      {
        index: 1,
        timestamp: 1693584518776,
        transactions: [],
        nonce: 1,
        hash: "Genesis",
        previousBlockHash: "Genesis",
      },
    ];
    this.pendingTransactions = [];
    this.ledger = { cars: [], owners: [], dealerships: [] };
    this.nodeUrl = process.argv[3];
    this.networkNodes = [];
  }

  createNewBlock(nonce, previousBlockHash, hash) {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      nonce: nonce,
      hash: hash,
      previousBlockHash: previousBlockHash,
    };
    this.chain.push(newBlock);
    return newBlock;
  }

  emptyPendingTransactions(newBlock) {
    newBlock.transactions.map((transaction) => {
      switch (transaction.transactionType) {
        case "newCar":
          const { name, publicKey, location, vin, make, model, year, owner } =
            transaction.details;
          if (vin && make && model && year && owner)
            this.ledger.cars.push(transaction.details);
          break;
        case "newPerson":
          // if (name && publicKey)
          this.ledger.owners.push(transaction.details);
          break;
        case "newDealership":
          // if (name && location && publicKey)
          this.ledger.dealerships.push(transaction.details);
          break;
        case "newOwner":
          // if (vin && owner) {
          // const keys = new Keys({ publicKey: owner });
          // if (vin + owner === keys.decryptWithPublicKey(encryptedTransaction))
          this.ledger.cars.find((car) => car.vin === vin).owner = newOwner;
          // }
          break;
        case "newService":
          // if (publicKey && vin && service) {
          // const keys = new Keys({ publicKey });
          // if (
          // vin + service ===
          // keys.decryptWithPublicKey(encryptedTransaction)
          // )
          this.ledger.cars.push(transaction.details);
          // }
          break;
      }
    });
    this.pendingTransactions = [];
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addTransactionToPendingTransactions(transaction) {
    this.pendingTransactions.push(transaction);
    return this.getLastBlock()["index"] + 1;
  }

  hashBlock(previousBlockHash, currentBlockData, nonce) {
    const dataAsString =
      previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
  }

  proofOfWork(previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, 4) !== "0000") {
      nonce++;
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }
    return nonce;
  }

  chainIsValid(blockchain) {
    const isValid = blockchain.every((block, index) => {
      if (index === 0) {
        if (
          block.hash !== "Genesis" ||
          block.previousBlockHash !== "Genesis" ||
          block.data
        ) {
          return false;
        } else {
          return true;
        }
      }

      const { previousBlockHash, hash, nonce, transactions } = block;
      const currentBlockData = {
        transactions: transactions,
        index: index + 1,
      };

      const generatedHash = this.hashBlock(
        previousBlockHash,
        currentBlockData,
        nonce
      );
      const previousBlock = blockchain[index - 1];

      if (hash !== generatedHash || previousBlockHash !== previousBlock.hash) {
        return false;
      } else {
        return true;
      }
    });
    return isValid;
  }

  findBlock(blockHash) {
    return this.chain.find((block) => block.hash === blockHash);
  }

  findTransaction(transactionId) {
    let correctBlock = null;
    let correctTransaction = null;

    this.chain.find((block) => {
      block.transactions.find((transaction) => {
        if (transaction.transactionId === transactionId) {
          correctBlock = block;
          correctTransaction = transaction;
        }
      });
    });
    return { block: correctBlock, transaction: correctTransaction };
  }
}
module.exports = Blockchain;
