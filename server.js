const express = require("express");
const {
    Client
} = require("@hashgraph/sdk");
const environment_variables = require("./environment_variables");

// Hedera
const client = Client.forTestnet();
client.setOperator(
    environment_variables.operatorId,
    environment_variables.operatorKey
);

// Express
const app = express();
app.get("/", (req, res) => res.send("Hello, World!"));
app.listen(
    environment_variables.port,
    () => console.log(`Fair Team Builder server listening on port ${environment_variables.port}.`)
);
