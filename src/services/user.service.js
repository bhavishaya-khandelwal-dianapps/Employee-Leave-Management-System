//* Require "User" collection 
const User = require("../models/user.model.js");
const { generateToken } = require("../utilities/generateToken.js");


//* This function is going to register a new user  
async function registerNewUser(body) {
    const newUser = new User(body);

    //* Generate token 
    let token = generateToken();

    let result = await newUser.save();

    //* If there is error in saving data into "User" collection 
    if(!result) throw new Error("User already exist");

    return { result, token };
};



//* Now, I want to find user using it's email 
async function getUserByEmail(email) {
    let user = await User.findOne({ email });
    if(user == null) throw new Error("Sorry user not found, check your token or email");
    return user;
}


//* This function is used to find all users  
async function retrieveUsers() {
    let users = await User.find({}).select({name : 1, role : 1, designation : 1, phoneNumber : 1, gender : 1, email : 1, createdAt : 1});
    console.log('users :', users);
    if(users.length == 0) throw new Error("OOPs, no user found!!!"); 
    return users;
}



//* This function is used to find all users by their role 
async function retrieveUsersByRole(role) {
    console.log("Role =", role);
    let users = await User.find({ role }).select({name : 1, role : 1, designation : 1, phoneNumber : 1, gender : 1, email : 1, createdAt : 1});
    console.log('users :', users);
    if(users.length == 0) throw new Error("OOPs, no user found with given role");
    return users;
}


module.exports = {
    registerNewUser, 
    getUserByEmail,
    retrieveUsers,
    retrieveUsersByRole
};