const express = require("express");
const {
    Client,
    MirrorClient,
    ConsensusTopicCreateTransaction
} = require("@hashgraph/sdk");
const environment_variables = require("./environment_variables");

// Hedera
const client = Client.forTestnet();
client.setOperator(
    environment_variables.operatorId,
    environment_variables.operatorKey
);
const mirrorClient = new MirrorClient(
    "hcs.testnet.mirrornode.hedera.com:5600"
);
let _topicId;
async function getTopicId() {
    if (_topicId !== undefined) {
        return _topicId;
    }

    const tx = await new ConsensusTopicCreateTransaction().execute(client);
    console.log(`ConsensusTopicCreateTransaction submitted. txid ${tx}`);
    const receipt = await tx.getReceipt(client);
    const ret = receipt.getConsensusTopicId();
    console.log(`ConsenssusTopicCreateTransaction completed. topic id ${ret}`);
    _topicId = ret;
    return ret;
}

// Express
const app = express();
app.use(express.static("static"));
app.use(express.static("dist"));
app.get("/topic/id", async function(req, res) {
    res.json(await getTopicId());
});
app.listen(
    environment_variables.port,
    () => console.log(`Fair Team Builder server listening on port ${environment_variables.port}.`)
);
