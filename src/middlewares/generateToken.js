const jwt = require("jsonwebtoken");


//* This function is going to generate a new token 
function generateToken(email) {
    const PAYLOAD = {
        email : email
    };
    console.log("PayLoad =", PAYLOAD);

    const token = jwt.sign(PAYLOAD, process.env.SECRET_KEY);
    console.log("Token =", token);
    return token;
};

module.exports = {
    generateToken
}