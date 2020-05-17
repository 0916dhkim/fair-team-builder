// Use .env file.
require("dotenv").config();

// Provide default values.
// There is no default for operatorId and operatorKey.
module.exports = {
    port: process.env.PORT || 3000,
    specialChar: process.env.SPECIAL_CHAR || "ℏ",
    operatorId: process.env.OPERATOR_ID,
    operatorKey: process.env.OPERATOR_KEY
};
