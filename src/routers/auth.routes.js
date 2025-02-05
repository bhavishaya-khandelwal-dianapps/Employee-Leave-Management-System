const express = require("express");
const authRouter = express.Router();
const authControl = require("../controllers/auth.controller.js");


//* Register a new user  
authRouter.post("/register", authControl.registerUser);

//* Login a registered user 
authRouter.post("/login", authControl.login);

//* Export authRouter  
module.exports = authRouter;