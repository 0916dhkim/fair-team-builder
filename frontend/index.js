import "bootstrap/dist/css/bootstrap.min.css";
const {
    Client,
    ConsensusMessageSubmitTransaction
} = require("@hashgraph/sdk");
const axios = require("axios").default;

const MAX_TEAM_SIZE = 4;

const user = JSON.parse(
    localStorage.getItem("user")
);

function renderHeader() {
    const header = document.getElementById("header");
    if (user) {
        const greetings = document.createElement("h5");
        greetings.className = "my-0 mr-md-auto font-weight-normal";
        greetings.innerText = `Hello, ${user.username}`;
        header.appendChild(greetings);
        const logoutLink = document.createElement("a");
        logoutLink.className = "btn btn-outline-primary";
        logoutLink.innerText = "Logout";
        logoutLink.href = "/logout";
        header.appendChild(logoutLink);
    } else {
        const loginLink = document.createElement("a");
        loginLink.className = "btn btn-outline-primary";
        loginLink.innerText = "Login";
        loginLink.href = "/login";
        header.appendChild(loginLink);
    }
}

const teamsContainer = document.getElementById("teams-container");
function renderTeams(teams) {
    teamsContainer.innerHTML = "";
    for (const team of teams) {
        const container = document.createElement("div");
        container.className = "col-sm-12 pt-3";
        teamsContainer.appendChild(container);

        const card = document.createElement("div");
        card.className = "card p-3";
        container.appendChild(card);

        const name = document.createElement("h3");
        name.innerText = team.name;
        card.appendChild(name);

        const memberList = document.createElement("ul");
        memberList.className = "list-group";
        card.appendChild(memberList);
        for (const member of team.members) {
            const memberElement = document.createElement("li");
            memberElement.className = "list-group-item";
            memberElement.innerText = member.name;
            memberList.appendChild(memberElement);
        }

        // Check if the user is in this team.
        let includesUser = false;
        for (const member of team.members) {
            if (member.name === user.username) {
                includesUser = true;
                break;
            }
        }
        if (includesUser) {
            const leaveButton = document.createElement("button");
            leaveButton.className = "btn btn-danger mt-3";
            leaveButton.innerText = "Leave";
            leaveButton.onclick = function() {
                sendMessage(["LEAVE", team.name, user.username]);
            }
            card.appendChild(leaveButton);
        } else if (team.members.length < MAX_TEAM_SIZE) {
            const joinButton = document.createElement("button");
            joinButton.className = "btn btn-success mt-3";
            joinButton.innerText = "Join";
            joinButton.onclick = function() {
                sendMessage(["JOIN", team.name, user.username]);
            }
            card.appendChild(joinButton);
        }
    }
}

const freeAgentsContainer = document.getElementById("free-agents-container");
function renderFreeAgents(freeAgents) {
    freeAgentsContainer.innerHTML = "";
    for (const freeAgent of freeAgents) {
        const container = document.createElement("div");
        container.className = "col-sm-12 pt-3";
        freeAgentsContainer.appendChild(container);

        const card = document.createElement("div");
        card.className = "card p-3";
        container.appendChild(card);

        const name = document.createElement("h3");
        name.innerText = freeAgent.name;
        card.appendChild(name);

        const description = document.createElement("p");
        description.innerText = freeAgent.description;
        card.appendChild(description);
    }
}

const teamCreationForm = document.getElementById("team-creation-form");
const teamName = document.getElementById("teamname");
const teamDescription = document.getElementById("team-description");
teamCreationForm.onsubmit = function(e) {
    e.preventDefault();
    sendMessage(["CREATE", teamName.value, user.username, teamDescription.value]);
}

const freeAgentRegistrationForm = document.getElementById("free-agent-registration-form");
const freeAgentDescription = document.getElementById("free-agent-description");
freeAgentRegistrationForm.onsubmit = function(e) {
    e.preventDefault();
    sendMessage(["REGISTER", user.username, freeAgentDescription.value]);
}

async function getTeams() {
    return (await axios.get("/teams")).data;
}
async function getFreeAgents() {
    return (await axios.get("/free-agents")).data;
}
async function getTopicId() {
    return (await axios.get("/topic/id")).data;
}

renderHeader();
if (user) {
    const content = document.getElementById("content");
    content.style = "";
    Promise.resolve(getTeams()).then(teams => renderTeams(teams));
    Promise.resolve(getFreeAgents()).then(freeAgents => renderFreeAgents(freeAgents));
}

async function sendMessage(words) {
    console.log(`Sending message ${words}`);
    const client = Client.forTestnet();
    client.setOperator(
        user.accountId,
        user.privateKey
    );
    new ConsensusMessageSubmitTransaction()
        .setTopicId(await getTopicId())
        .setMessage(words.join("ℏ"))
        .execute(client);
}
