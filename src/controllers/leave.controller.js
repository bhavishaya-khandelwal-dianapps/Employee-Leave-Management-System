//* Create a leave request 
async function applyLeave(req, res) {
    try {
        console.log("Req.email =", req.email);
        console.log("Req.token =", req.token);
        const body = {
            startDate : req.body.startDate, 
            endDate : req.body.endDate,
            leaveType : req.body.leaveType,
            reason : req.body.reason,
            shift : req.body.shift, 
        }

        if(!body.startDate || !body.endDate || !body.leaveType || !body.reason || !body.shift) {
            return res.status(400).send("Please provide all fields (startDate[YYYY-MM-DD], endDate[YYYY-MM-DD], leaveType, reason, shift)");
        }

        
        //* Check startDate or endDate is collide or not  
        const dates = await LeaveRecord.find({ email : req.email }, "startDate endDate");
        let startDateToCheck = new Date(body.startDate);
        let endDateToCheck = new Date(body.endDate);
        if(dates.length != 0) {
            for(let value of dates) {
                let dateFrom = value.startDate;
                let dateTo = value.endDate;
                if(common.isDateInRange(startDateToCheck, dateFrom, dateTo)) {
                    return res.status(400).send("Leave with given date already exist");
                }
                if(common.isDateInRange(endDateToCheck, dateFrom, dateTo)) {
                    return res.status(400).send("Leave with given date already exist");
                }
            }
        }


        //* Now, we need to update "requestedLeaves" field in "User" collection
        const leaveDetail = await service.requestLeave(req.email, req.body);
        console.log("Leave Detail =", leaveDetail);


        return res.status(200).send({
            message : "Leave Requested", 
            token : req.token,
            leaveDetail : leaveDetail
        });
    }
    catch(error) {
        res.status(400).send(`${error}`);
    }
};





//* THis function is used to show leave requests of all employees to hr and leave requests of HR's to managers 
async function showLeaves(req, res) {

    //* Get leave details based on role
    const getLeaveRecord = await service.getLeaveDetails(req.email);
    return res.status(200).send(getLeaveRecord);
};