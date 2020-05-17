import "bootstrap/dist/css/bootstrap.min.css";
const {
    Client,
    AccountInfoQuery
} = require("@hashgraph/sdk");

const usernameInput = document.getElementById("username");
const accountIdInput = document.getElementById("accountId");
const publicKeyInput = document.getElementById("publicKey");
const privateKeyInput = document.getElementById("privateKey");

async function verifyUser(user) {
    const client = Client.forTestnet();
    client.setOperator(
        user.accountId,
        user.privateKey
    );
    const tx = await new AccountInfoQuery()
        .setAccountId(user.accountId)
        .execute(client);
    if (tx.isDeleted) {
        throw "Cannot verify deleted account.";
    }

    return user;
}

function login(e) {
    e.preventDefault();
    const user = {
        username: usernameInput.value,
        accountId: accountIdInput.value,
        publicKey: publicKeyInput.value,
        privateKey: privateKeyInput.value
    }

    console.log("Logging in", user);

    Promise.resolve(verifyUser(user)).then(
        (user) => {
            localStorage.setItem("user", JSON.stringify(user));
            window.location.replace("/");
        },
        (error) => {
            console.error(error);
        }
    )
}

const form = document.getElementById("loginForm");
form.onsubmit = login;
