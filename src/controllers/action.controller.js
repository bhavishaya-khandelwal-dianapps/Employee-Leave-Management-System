const userService = require("../services/user.service.js");
const leaveService = require("../services/leave.service.js");


//* This function is used to take action on leave request 
async function respondToLeaveRequest(req, res) {
    try {
        let userByEmail = await userService.getUserByEmail(req.email);
        console.log('userByEmail :', userByEmail);
        let role = userByEmail.role;

        if(role == "EMPLOYEE") {
            return res.status(400).send("Sorry, you don't have permission");
        } 


        let status = (req.body.status).toUpperCase();
        let id = req.params.id;


        let userById = await userService.getUserById(id);
        console.log('userById :', userById);
        let role_2 = userById.role; 

        //* HR can't take action on their own request  
        if(role == "HR" && role_2 == "HR") return res.status(400).send("Sorry, you don't have permission");


        const earliestRequestStatus = await leaveService.updateEarliestPendingLeave(userById, status);

        return res.status(200).send({
            body : status, 
            message : earliestRequestStatus
        });
        
    }
    catch(error) {
        res.status(400).send(`${error}`);
    }
};





module.exports = {
    respondToLeaveRequest
}