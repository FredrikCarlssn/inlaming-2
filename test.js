const crypto = require("crypto");

class Keys {
  constructor({ privateKey, publicKey }) {
    if (privateKey && publicKey) {
      this.privateKey = this.regeneratePrivateKey(privateKey);
      this.publicKey = this.regeneratePublicKey(publicKey);
    } else if (publicKey) {
      this.publicKey = this.regeneratePublicKey(publicKey);
    } else {
      const { privateKey, publicKey } = this.generateKeyPairSync("test");
      this.privateKey = privateKey;
      this.publicKey = publicKey;
    }
  }

  generateKeys(passphrase) {
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        cipher: "aes-256-cbc",
        passphrase: passphrase,
      },
    });

    return { privateKey, publicKey };
  }

  encryptWithPrivateKey(privateKey, message) {
    const buffer = Buffer.from(message, "utf-8");
    const encrypted = crypto.privateEncrypt(
      {
        key: privateKey.toString(),
        passphrase: "test",
      },
      buffer
    );
    return encrypted.toString("base64");
  }

  decryptWithPublicKey(publicKey, encryptedMessage) {
    let decrypted = crypto
      .publicDecrypt(
        publicKey.toString(),
        Buffer.from(encryptedMessage, "base64")
      )
      .toString();
    return decrypted;
  }

  formatPrivateKey(privateKey) {
    let privateKeyString = privateKey.toString();
    const delimiter = "@";
    privateKeyString = privateKeyString.replace(/\n/g, delimiter);
    privateKeyString = privateKeyString.replace(
      /-----BEGIN ENCRYPTED PRIVATE KEY-----@/g,
      ""
    );
    privateKeyString = privateKeyString.replace(
      /@-----END ENCRYPTED PRIVATE KEY-----/g,
      ""
    );
    return privateKeyString;
  }

  formatPublicKey(publicKey) {
    let publicKeyString = publicKey.toString();
    const delimiter = "@";
    publicKeyString = publicKeyString.replace(/\n/g, delimiter);
    publicKeyString = publicKeyString.replace(
      /-----BEGIN PUBLIC KEY-----@/g,
      ""
    );
    publicKeyString = publicKeyString.replace(/@-----END PUBLIC KEY-----/g, "");
    return publicKeyString;
  }

  regeneratePrivateKey(privateKey) {
    privateKey =
      "-----BEGIN ENCRYPTED PRIVATE KEY-----@" +
      privateKey +
      "@-----END ENCRYPTED PRIVATE KEY-----";
    privateKey = privateKey.split("@").join("\n");
    const newPrivateKey = crypto.createPrivateKey({
      key: privateKey.toString(),
      format: "pem",
      type: "pkcs8",
      passphrase: "test",
    });
    return newPrivateKey;
  }

  regeneratePublicKey(publicKey) {
    publicKey =
      "-----BEGIN PUBLIC KEY-----@" + publicKey + "@-----END PUBLIC KEY-----";
    publicKey = publicKey.split("@").join("\n");
    const newPrivateKey = crypto.createPublicKey({
      key: privateKey.toString(),
      type: "spki",
      format: "pem",
    });
    return newPrivateKey;
  }
}
