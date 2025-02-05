const User = require("../models/user.model.js");
const LeaveRecord = require("../models/leaveRecord.model.js");
const holidayService = require("../services/holiday.service.js");
const { calculateLeaveCount } = require("../utilities/leaveCalculator.js");


//* This function is used to find "startDate" and "endDate" of previously applied leaves 
async function fetchLeavePeriodByEmail(email) {
    const dates = await LeaveRecord.find({ email }, "startDate endDate");
    return dates;
};



//* This function is used to apply for a leave 
async function applyForLeave(body, user) {

    //* Create a leave record and update the "requestedLeaves" field in the "User" collection.

    let startDate = body.startDate.toString();
    startDate = new Date(startDate);
    console.log('startDate :', startDate);
    let endDate = body.endDate.toString();
    endDate = new Date(endDate);
    console.log('endDate :', endDate);
    let shift = (body.shift).toUpperCase();
    console.log('shift :', shift);


    //* It it does not get any value, it remain empty and that dosen't create any issue 
    let holidayListArray = await holidayService.retrieveHolidayDates();


    let leaveCount =  calculateLeaveCount(startDate, endDate, shift, holidayListArray);
    let updatedRequestedLeaves = (parseFloat(leaveCount) + parseFloat(user.requestedLeaves)).toString();


    // //* Here we are updating "requestedLeaves" field of "User" collection 
    const updatedUser = await User.findByIdAndUpdate({ _id : user._id }, { $set : { requestedLeaves : updatedRequestedLeaves } }, { new : true });
    if(Object.keys(updatedUser).length == 0) throw new Error("OOPs, some problem occur while updating 'requestedLeaves' field");


    //* Create a new leave record
    const newLeaveRecord = new LeaveRecord({
        userId : user._id.toString(),
        role : user.role,
        email : user.email,  
        startDate : new Date(body.startDate), 
        endDate : new Date(body.endDate), 
        leaveType : body.leaveType, 
        reason : body.reason, 
        shift : body.shift, 
        leaveCount : leaveCount
    });
    const result = await newLeaveRecord.save();
    if(Object.keys(result).length == 0) throw new Error("OOPs, leave request not saved");

    return result;
};



//* Get leave details based on role  
async function retrieveLeaveInfo(role, email) {
    switch(role) {
        case "EMPLOYEE" : 
            const specificEmployeeLeaveRecord = await LeaveRecord.find({ email });
            if(specificEmployeeLeaveRecord.length == 0) throw new Error("No record found");
            return specificEmployeeLeaveRecord;
        
        case "HR" : 
            const employeesLeaveRecord = await LeaveRecord.find({ role : "EMPLOYEE" });
            if(employeesLeaveRecord.length == 0) throw new Error("No record found");
            return employeesLeaveRecord;

        case "MANAGER" :
            const hrLeaveRecord = await LeaveRecord.find({ role : "HR" });
            if(hrLeaveRecord.length == 0) throw new Error("No record found");
            return hrLeaveRecord;
    }
};





//* This function is used to update the oldest leave request whose status is "NULL" 
async function updateEarliestPendingLeave(user, status) {
    
    const leaveDetails = await LeaveRecord.aggregate([
        {
            $match : { userId : (user._id).toString(), status : "NULL" }
        },
        {
            $sort : { startDate : 1 }
        },
        {
            $limit : 1
        }
    ]);
    if(leaveDetails.length == 0) throw new Error("No pending leave request");


    //* Now, whenever we are takig action on leave request, then we need to update some fields of "USER" collection (availableLeaves, approvedLeaves, rejectedLeaves) 
    let leaveCount = leaveDetails[0].leaveCount;
    leaveCount = parseFloat(leaveCount);

    const userDetail = await User.findOne({ _id : user._id });

    let availableLeaves, approvedLeaves, rejectedLeaves, updatedUserDetails;
    switch(status) {
        case "APPROVED" : 
            const result = await LeaveRecord.updateOne(
                { userId : (user._id).toString(), status : "NULL" }, 
                { $set : { status } }, 
                { new : true }
            ).sort({ startDate : 1 });
            if(result.modifiedCount == 0) throw new Error("No pending leave request");
            availableLeaves = parseFloat(userDetail.availableLeaves) - leaveCount;
            availableLeaves = availableLeaves.toString();
            approvedLeaves = parseFloat(userDetail.approvedLeaves) + leaveCount;
            approvedLeaves = approvedLeaves.toString();
            updatedUserDetails = await User.findByIdAndUpdate({ _id : user._id }, { $set : { availableLeaves, approvedLeaves } }, { new : true });
            if(Object.keys(updatedUserDetails).length == 0) throw new Error("Sorry, Action failed");
            return updatedUserDetails;

        case "REJECTED" :
            const result_2 = await LeaveRecord.updateOne(
                { userId : (user._id).toString(), status : "NULL" }, 
                { $set : { status } }, 
                { new : true }
            ).sort({ startDate : 1 });
            if(result_2.modifiedCount == 0) throw new Error("No pending leave request");
            rejectedLeaves = parseFloat(userDetail.rejectedLeaves) + leaveCount;
            rejectedLeaves = rejectedLeaves.toString();
            updatedUserDetails = await User.findByIdAndUpdate({ _id : user._id }, { $set : { rejectedLeaves } }, { new : true });
            if(Object.keys(updatedUserDetails).length == 0) throw new Error("Sorry, Action failed");
            return updatedUserDetails;
        
        default : 
            throw new Error("Please provide correct status");
    }
};



module.exports = {
    fetchLeavePeriodByEmail,
    applyForLeave,
    retrieveLeaveInfo,
    updateEarliestPendingLeave
}