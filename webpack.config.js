const path = require("path");

const production = process.env.NODE_ENV === "production" || false;

module.exports = {
    mode: production ? "production" : "development",
    entry: {
        index: "./frontend/index.js"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist")
    },
    devtool: "inline-source-map"
}
