// Use .env file.
require("dotenv").config();

// Provide default values.
module.exports = {
    port: process.env.PORT || 3000
};
