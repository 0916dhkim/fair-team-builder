const {
    Client
} = require("@hashgraph/sdk");

const MAX_TEAM_SIZE = 4;

const user = JSON.parse(
    localStorage.getItem("user")
);

function renderHeader() {
    const header = document.getElementById("header");
    if (user) {
        const greetings = document.createElement("h3");
        greetings.innerText = `Hello, ${user.username}`;
        header.appendChild(greetings);
        const logoutLink = document.createElement("a");
        logoutLink.innerText = "Logout";
        logoutLink.href = "/logout";
        header.appendChild(logoutLink);
    } else {
        const loginLink = document.createElement("a");
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
        teamsContainer.appendChild(container);

        const name = document.createElement("h3");
        name.innerText = team.name;
        container.appendChild(name);

        if (team.members.length < MAX_TEAM_SIZE) {
            const joinButton = document.createElement("button");
            joinButton.innerText = "Join";
            container.appendChild(joinButton);
        }

        const memberList = document.createElement("ul");
        container.appendChild(memberList);
        for (member of team.members) {
            const memberElement = document.createElement("li");
            memberElement.innerText = member.name;
            memberList.appendChild(memberElement);
        }
    }
}

const freeAgentsContainer = document.getElementById("free-agents-container");
function renderFreeAgents(freeAgents) {
    freeAgentsContainer.innerHTML = "";
    for (const freeAgent of freeAgents) {
        const container = document.createElement("div");
        freeAgentsContainer.appendChild(container);
        const name = document.createElement("h3");
        name.innerText = freeAgent.name;
        container.appendChild(name);
        const description = document.createElement("p");
        description.innerText = freeAgent.description;
        container.appendChild(description);
    }
}

renderHeader();
renderTeams([]);
renderFreeAgents([]);
