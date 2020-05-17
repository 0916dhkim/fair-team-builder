const express = require("express");
const path = require("path");
const TextDecoder = require("text-encoding").TextDecoder;
const {
    Client,
    MirrorClient,
    MirrorConsensusTopicQuery,
    ConsensusTopicCreateTransaction
} = require("@hashgraph/sdk");
const environment_variables = require("./environment_variables");

// Data
const teams = new Map();
const freeAgents = new Map();

function hasTeam(username) {
    for (const team of teams.values()) {
        for (const member of team.members) {
            if (member.name === username) {
                return true;
            }
        }
    }
    return false;
}
function registerFreeAgent(username, description) {
    // Check if the user is already in the system.
    if (freeAgents.has(username)) {
        throw `${username} is already a free agent.`;
    }
    if (hasTeam(username)) {
        throw `${username} already has a team.`;
    }

    // Register.
    freeAgents.set(
        username,
        {
            name: username,
            description: description
        }
    )
}
function createTeam(teamname, username, description) {
    if (!freeAgents.has(username)) {
        throw "Only free agents can create new teams.";
    }
    if (hasTeam(username)) {
        throw `${username} already has a team.`;
    }
    if (teams.has(teamname)) {
        throw `${teamname} already exists.`;
    }

    // Leave FA.
    const user = freeAgents.get(username);
    freeAgents.delete(username);
    // Create team.
    teams.set(
        teamname,
        {
            name: teamname,
            description: description,
            members: [user]
        }
    )
}
function joinTeam(teamname, username) {
    if (!freeAgents.has(username)) {
        throw "Only free agents can join teams.";
    }
    if (hasTeam(username)) {
        throw `${username} already has a team`;
    }

    // Leave FA.
    const user = freeAgents.get(username);
    freeAgents.delete(username);
    // Join team.
    const team = teams.get(teamname);
    team.members.push(user);
}
function leaveTeam(teamname, username) {
    const team = teams.get(teamname);
    let i = 0;
    for (; i < team.members.length; i++) {
        if (team.members[i].name === username) {
            break;
        }
    }
    if (i === team.members.length) {
        throw `${username} is not a member of ${teamname}`;
    }
    // Leave team.
    const user = team.members[i];
    team.members.splice(i, 1);
    // Join FA.
    freeAgents.set(username, user);
    // Clean up empty teams.
    if (team.members.length === 0) {
        teams.delete(teamname);
    }
}
async function handleMessage(message) {
    console.log(`Handling message : ${message}`);

    const words = message.split(environment_variables.specialChar);

    try {
        if (words.length === 0) {
            return;
        } else if (words[0] === "REGISTER" && words.length === 3) {
            // Register free agent.
            const [, username, description] = words;
            registerFreeAgent(username, description);
        } else if (words[0] === "CREATE" && words.length === 4) {
            // Create team.
            const [, teamname, username, description] = words;
            createTeam(teamname, username, description);
        } else if (words[0] === "JOIN" && words.length === 3) {
            // Join team.
            const [, teamname, username] = words;
            joinTeam(teamname, username);
        } else if (words[0] === "LEAVE" && words.length === 3) {
            // Leave team.
            const [, teamname, username] = words;
            leaveTeam(teamname, username);
        }
    } catch (e) {
        console.log(e);
    }

    return;
}

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
Promise.resolve(getTopicId()).then(async (topicId) => {
    console.log("Wait for topic subscription ...");
    await new Promise(res => setTimeout(res ,9000));
    new MirrorConsensusTopicQuery()
        .setTopicId(topicId)
        .subscribe(mirrorClient, res => {
            const message = new TextDecoder("utf-8").decode(res.message);
            handleMessage(message);
        });
    console.log(`Subscribed to topic ${topicId}`);
});

// Express
const app = express();
app.use(express.static("dist"));
app.get("/", (req, res) => res.sendFile(path.resolve(__dirname, "static/index.html")));
app.get(
    "/login",
    (req, res) => res.sendFile(
        path.resolve(__dirname, "static/login.html")
    )
);
app.get(
    "/logout",
    (req, res) => res.sendFile(
        path.resolve(__dirname, "static/logout.html")
    )
);
app.get("/topic/id", async function(req, res) {
    res.json(await getTopicId());
});
app.get(
    "/teams",
    (req, res) => {
        res.json(Array.from(teams.values()));
    }
);
app.get(
    "/free-agents",
    (req, res) => {
        res.json(Array.from(freeAgents.values()));
    }
);
app.listen(
    environment_variables.port,
    () => console.log(`Fair Team Builder server listening on port ${environment_variables.port}.`)
);
