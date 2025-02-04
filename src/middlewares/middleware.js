const jwt = require("jsonwebtoken");


//* Validate all the fields 
const validate = require("../common/validateAllFields.js");



//* This function is going to generate a new token 
async function generateToken(req, res, next) {
    try {
        if(!req.body.email) return res.status(400).send("Please provide EMAIL and all other fields");

        const PAYLOAD = {
            email : req.body.email
        };

        const token = await jwt.sign(PAYLOAD, process.env.SECRET_KEY);

        if(!token) {
            return res.status(500).send("Token generation failed");
        }

        req.token = token;
        req.user = req.body;
        next();

    }
    catch(error) {
        res.status(500).send("Token generation failed");
    }
};




//* This function is going to verify token 
async function verifyToken(req, res, next) {
    try {
        //* Get token 
        let token = req.headers.authorization;
        if(!token) return res.status(400).send("Please provide token to verify");
        token = token.split(" ")[1]; 


        //* Verify token 
        let isVerified = await jwt.verify(token, process.env.SECRET_KEY);
        console.log('isVerified :', isVerified);
        if(!isVerified) {
            return res.status(400).send("Token verification failed");
        }
        req.email = isVerified.email;
        req.token = token;
        next();
    }
    catch(error) {
        res.status(400).send(`${error}`);
    }
};


module.exports = {
    generateToken, 
    verifyToken
}