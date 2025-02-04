//* Require necessary collections 
const User = require("../models/userCollection.js");
const LeaveRecord = require("../models/leaveRecordCollection.js");
const Holiday = require("../models/holidayCollection.js");
const common = require("../common/getLeaveCount.js");
const { getPublicHolidaysArray } = require("../common/getPublicHolidays.js");


//* This function is going to create a new user  
async function createUser(body) {
    const newUser = new User(body);
    const result = await newUser.save();
    console.log('result :', result);
    return result;
};



//* This function is used to find a specific user  
async function findUser(email) {
    const user = await User.findOne({ email });
    return user;
}; 



//* This function is used to find all users  
async function listAllUsers(role) {
    if(role == undefined) {
        const users = await User.find({}).select({name : 1, role : 1, designation : 1, phoneNumber : 1, gender : 1, email : 1, createdAt : 1}).sort({ role : -1 });
        return users;
    }
    const users = await User.find({ role }).select({name : 1, role : 1, designation : 1, phoneNumber : 1, gender : 1, email : 1, createdAt : 1});
    return users;
}



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




//* Add holiday to the collection 
async function addHolidayIntoCollection(body) {
    const holiday = new Holiday(body);
    const result = await holiday.save();
    return result;
};




//* List all the public holidays  
async function getPublicHolidays() {
    const result = await Holiday.find( {} );
    return result;
};




//* Update holiday using id  
async function updateSpecificHoliday(id, toUpdate) {
    console.log("toUpdate =", toUpdate);
    let result = await Holiday.findByIdAndUpdate({ _id : id }, { $set : toUpdate }, { new : true });
    console.log("Result =", result);
    return result;
};




//* This function is used to update the oldest leave request whose status is "NULL" 
async function updateOldestLeaveRequest(id, status) {
    const result = await LeaveRecord.updateOne({ userId : id, status : "NULL" }, { $set : { status } }, { new : true }).sort({ startDate : 1 });
    console.log('result :', result);
    if(result.modifiedCount == 1) return 1; 
    return 0;
};



module.exports = {
    createUser, 
    findUser, 
    listAllUsers, 
    requestLeave, 
    getLeaveDetails, 
    addHolidayIntoCollection, 
    getPublicHolidays, 
    updateSpecificHoliday, 
    updateOldestLeaveRequest
}