const jwt = require("jsonwebtoken");


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
    verifyToken
}