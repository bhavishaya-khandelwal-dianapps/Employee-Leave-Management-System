
//* This function is used to take action on leave request 
async function takeActionOnLeaveRequest(req, res) {
    try {
        let email = req.email;
        console.log("Email =", email);
        let role = await User.findOne({ email }).select({ role : 1 });
        if(role.role == "EMPLOYEE") {
            return res.status(400).send("Sorry, you don't have permission");
        } 
        const status = (req.body.status).toUpperCase();
        let id = req.params.id;
        let ROLE = await User.findOne({ _id : id }).select({ role : 1 });

        //* HR can't take action on their own request  
        if(role.role == "HR" && ROLE.role == "HR") return res.status(400).send("Sorry, you don't have permission");

        const updateOldestRequest = await service.updateOldestLeaveRequest(id, status);
        if(updateOldestRequest == null) {
            return res.status(400).send({
                body : status, 
                message : "Please check userID || No Pending leave requests",
            });
        }
        else {
            return res.status(200).send({
                body : status, 
                message : updateOldestRequest
            });
        }
    }
    catch(error) {
        res.status(400).send(`${error}`);
    }
};

