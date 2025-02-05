//* Require "jsonwebtoken" library 
const jwt = require("jsonwebtoken");


function generateToken(email) {
    const PAYLOAD = { email };
    const SECRET_KEY = process.env.SECRET_KEY;
    const token = jwt.sign(PAYLOAD, SECRET_KEY);
    return token;
}


module.exports = {
    generateToken
}