const validate = require("../validation/user.validate.js");
const bcrypt = require("bcryptjs");
const userService = require("../services/user.service.js");
const { generateToken } = require("../utilities/generateToken.js");


//* This function is used to register a new user 
async function registerUser(req, res) {
    try {
        //* Validate all fields  
        const isValid = await validate.validateRegistrationFields(req.body);

        //* It means you have missed some fields
        if(isValid == -1) {
            return res.status(400).send("All fields are required");
        }

        //* It means you have provided incorrect information 
        else if(isValid == 0) {
            return res.status(400).send("Please correct all the fields");
        }

        //* Before saving data into dataBase, we need to hash the password  
        req.body.password = await bcrypt.hash(req.body.password, 10);
        
        let output = await userService.registerNewUser(req.body);
        output["message"] = "User Created Successfully";        

        return res.status(201).send(output);
    }
    catch(error) {
        res.status(400).send(`${error}`);
    }
};



//* This function is used to login a registered user 
async function login(req, res) {
    try {
        const isValid = await validate.validateLoginFields(req.body);
        if(isValid == -1) return res.status(400).send("Please provide all fields");
        if(isValid == 0) return res.status(400).send("Please provide correct details");

        //* If email is correct then we get user data
        const user = await userService.getUserByEmail(req.body.email); //* Already handle the error in userService file  

        let isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordMatch) return res.status(400).send("Please provide valid credentials");

        //* Get token if password is matched (I know we have to generate token in service page, but if i do so then i need to make a new function in service page)
        let token = generateToken(req.body.email);

        return res.status(200).send({
            token : token, 
            user : user 
        });

    }
    catch(error) {
        res.status(400).send(`${error}`);
    }
}




module.exports = {
    registerUser, 
    login
}