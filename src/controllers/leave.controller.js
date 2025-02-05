const userService = require("../services/user.service.js");
const leaveService = require("../services/leave.service.js");
const { checkDateInRange } = require("../utilities/dateRangeChecker.js");



//* Create a leave request 
async function submitLeaveRequest(req, res) {
    try {
        if(!req.body.startDate || !req.body.endDate || !req.body.leaveType || !req.body.reason || !req.body.shift) return res.status(400).send("Please provide all fields (startDate[YYYY-MM-DD], endDate[YYYY-MM-DD], leaveType, reason, shift)");

        
        //* Check if the startDate or endDate overlaps with existing leave requests  
        const dates = await leaveService.fetchLeavePeriodByEmail(req.email);
        let startDateToCheck = new Date(req.body.startDate);
        let endDateToCheck = new Date(req.body.endDate);
        if(dates.length != 0) {
            for(let value of dates) {
                let dateFrom = value.startDate;
                let dateTo = value.endDate;
                if(checkDateInRange(startDateToCheck, dateFrom, dateTo)) {
                    return res.status(400).send("Leave with given date already exist");
                }
                if(checkDateInRange(endDateToCheck, dateFrom, dateTo)) {
                    return res.status(400).send("Leave with given date already exist");
                }
            }
        }


        //* Step 1 : Find the "User" with given email  
        const user = await userService.getUserByEmail(req.email);
        

        //* Step 2 : Update "requestedLeaves" field and add leave request 
        const leaveDetail = await leaveService.applyForLeave(req.body, user);

        return res.status(201).send({
            message : "Leave request added successfully", 
            leaveDetials : leaveDetail
        });
    }
    catch(error) {
        res.status(400).send(`${error}`);
    }
};




//* THis function is used to show leave requests of all employees to hr and leave requests of HR's to managers 
async function displayLeaves(req, res) {
    try {
        let user = await userService.getUserByEmail(req.email);
        let role = user.role;

        //* Get leave details based on role
        const getLeaveRecord = await leaveService.retrieveLeaveInfo(role, req.email);
        return res.status(200).send(getLeaveRecord);
    }
    catch(error) {
        res.status(400).send(`${error}`);
    }
};





module.exports = {
    submitLeaveRequest, 
    displayLeaves
}