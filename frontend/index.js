const {
    Client
} = require("@hashgraph/sdk");

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

renderHeader();
