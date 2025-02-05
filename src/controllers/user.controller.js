const userService = require("../services/user.service.js");


//* This function is used to all employees 
async function listAllUsers(req, res) {
    try {
        let role = req.query.role;
        if(role == undefined) {
            const allUsers = await userService.retrieveUsers();
            return res.status(200).send(allUsers);
        }
        else {
            role = role.toUpperCase();
            const allUsers = await userService.retrieveUsersByRole(role);
            return res.status(200).send(allUsers);
        }
    }
    catch(error) {
        return res.status(400).send(`${error}`);
    }
}; 



module.exports = {
    listAllUsers
}