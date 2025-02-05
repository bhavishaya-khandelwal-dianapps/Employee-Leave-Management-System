
//* This function is used to request leave 
async function requestLeave(email, body) {

    const userData = await User.findOne({ email });
    console.log("User Data =", userData);

    //* Create a leave record and update "requestedLeaves" field of "User" collection  
    let startDate = body.startDate.toString();
    startDate = new Date(startDate);
    let endDate = body.endDate.toString();
    endDate = new Date(endDate);
    let shift = (body.shift).toUpperCase();

    let publicHolidayArray = await getPublicHolidaysArray();

    let leaveCount =  common.getLeaveCount(startDate, endDate, shift, publicHolidayArray);
    let updatedRequestedLeaves = (parseFloat(leaveCount) + parseFloat(userData.requestedLeaves)).toString();


    //* Here we are updating "requestedLeaves" field of "User" collection 
    await User.findByIdAndUpdate({ _id : userData._id }, { $set : { requestedLeaves : updatedRequestedLeaves } });


    //* Create a new leave record
    const newLeaveRecord = new LeaveRecord({
        userId : userData._id.toString(),
        role : userData.role,
        email : userData.email,  
        startDate : new Date(body.startDate), 
        endDate : new Date(body.endDate), 
        leaveType : body.leaveType, 
        reason : body.reason, 
        shift : body.shift, 
        leaveCount : leaveCount
    });
    const result = await newLeaveRecord.save();
    console.log('Check Result :', result);

    return result;
};



//* Get leave details based on role  
async function getLeaveDetails(email) {
    let role = await User.findOne({ email }).select({ role : 1 });
    switch(role.role) {
        case "EMPLOYEE" : 
            const r1 = await LeaveRecord.find({ email });
            return r1;
        
        case "HR" : 
            const r2 = await LeaveRecord.find({ role : "EMPLOYEE" });
            return r2;

        case "MANAGER" :
            const r3 = await LeaveRecord.find({ role : "HR" });
            return r3;
    }
};





//* This function is used to update the oldest leave request whose status is "NULL" 
async function updateOldestLeaveRequest(id, status) {
    
    const leaveDetails = await LeaveRecord.aggregate([
        {
            $match : { userId : id, status : "NULL" }
        },
        {
            $sort : { startDate : 1 }
        },
        {
            $limit : 1
        }
    ]);
    if(leaveDetails.length == 0) return null;

    const result = await LeaveRecord.updateOne(
        { userId : id, status : "NULL" }, 
        { $set : { status } }, 
        { new : true }
    ).sort({ startDate : 1 });
    if(result.modifiedCount == 0) return null;

    //* Now, whenever we are takig action on leave request, then we need to update some fields of "USER" collection (availableLeaves, approvedLeaves, rejectedLeaves) 
    let leaveCount = leaveDetails[0].leaveCount;
    leaveCount = parseFloat(leaveCount);

    const userDetail = await User.findOne({ _id : id });

    let availableLeaves, approvedLeaves, rejectedLeaves, updatedUserDetails;
    switch(status) {
        case "APPROVED" : 
            availableLeaves = parseFloat(userDetail.availableLeaves) - leaveCount;
            availableLeaves = availableLeaves.toString();
            approvedLeaves = parseFloat(userDetail.approvedLeaves) + leaveCount;
            approvedLeaves = approvedLeaves.toString();
            updatedUserDetails = await User.findByIdAndUpdate({ _id : id }, { $set : { availableLeaves, approvedLeaves } }, { new : true });
            return updatedUserDetails

        case "REJECTED" :
            rejectedLeaves = parseFloat(userDetail.rejectedLeaves) + leaveCount;
            rejectedLeaves = rejectedLeaves.toString();
            updatedUserDetails = await User.findByIdAndUpdate({ _id : id }, { $set : { rejectedLeaves } }, { new : true });
            return updatedUserDetails;
    } 

    return updatedUserDetails;
};