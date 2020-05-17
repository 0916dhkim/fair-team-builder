const {
    Client
} = require("@hashgraph/sdk");

const accountIdInput = document.getElementById("accountId");
const publicKeyInput = document.getElementById("publicKey");
const privateKeyInput = document.getElementById("privateKey");

function login(e) {
    e.preventDefault();
    const user = {
        accountId: accountIdInput.value,
        publicKey: publicKeyInput.value,
        privateKey: privateKeyInput.value
    }

    console.log("Logging in", user);

    localStorage.setItem("user", JSON.stringify(user));

    // Redirect to index.
    window.location.replace("/");
}

const form = document.getElementById("loginForm");
form.onsubmit = login;
