const express = require("express");
const environment_variables = require("./environment_variables");
const app = express();

app.get("/", (req, res) => res.send("Hello, World!"));

app.listen(
    environment_variables.port,
    () => console.log(`Fair Team Builder server listening on port ${environment_variables.port}.`)
);
