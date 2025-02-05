//* Require service.js file  
const service = require("../services/service.js");
const hash = require("../common/hashAndComparePassword.js");
const common = require("../common/checkDateAlreadyExistOrNot.js")
const validate = require("../common/validateAllFields.js");
const LeaveRecord = require("../models/leaveRecordCollection.js");
const User = require("../models/userCollection.js");
const { generateToken } = require("../middlewares/generateToken.js");


//* This function is used to register a new user 
async function createNewUser(req, res) {
    try {
        const body = {
            name : req.body.name, 
            role : req.body.role, 
            designation : req.body.designation, 
            phoneNumber : req.body.phoneNumber, 
            age : req.body.age, 
            gender : req.body.gender,
            email : req.body.email, 
            password : req.body.password 
        }
        

        //* Validate al fields  
        const isValid = await validate.validateAllFields(body);
        if(isValid == -1) {
            return res.status(400).send("All fields are required");
        }
        else if(isValid == 0) {
            return res.status(400).send("Please correct all the fields");
        }

        //* Before saving data into dataBase, we need to hash the password  
        req.body.password = await hash.hashThePassword(req.body.password); 
        
        const result = await service.createUser(req.body);
        if(!result) return res.status(400).send("User already exist");

        //* Generate a new token 
        let token = generateToken(body.email);

        return res.status(201).send({
            message : "A new user is created", 
            token : token, 
            user : result
        });
    }
    catch(error) {
        res.status(400).send(`${error}`);
    }
};



//* This function is used to login a registered user 
async function loginUser(req, res) {
    try { 
        const email = req.body.email;
        const password = req.body.password; 

        if(!email || !password) return res.status(400).send("Please provide valid email and password");

        const userData = await service.findUser(email);
        console.log('userData :', userData);
        if(!userData) return res.status(400).send("Please provide valid email and password");


        //* Verify password 
        const isPasswordMatch = await hash.compareThePassword(password, userData.password);

        if(!isPasswordMatch) return res.status(400).send("Please provide valid email and password");

        //* Generate token  
        let token = generateToken(email);

        return res.status(200).send({
            message : "User logged in successfully",
            token : token, 
            user : userData 
        });
    }
    catch(error) {
        res.status(400).send(`${error}`);
    }
}





//* This function is used to all employees 
async function showAllUsers(req, res) {
    try {
        let role = req.params.role;
        if(role != undefined)
        role = role.toUpperCase();
        console.log("Role =", role);
        let token = req.token; 
        let email = req.email; 

        const result = await service.listAllUsers(role);
        if(!result) return res.status(400).send("Something went wrong");
        return res.status(200).send(result);
    }
    catch(error) {
        return res.status(400).send(`${error}`);
    }
}; 




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




//* THis function is used to add public holiday  
async function addHoliday(req, res) {
    try {
        const email = req.email;
        console.log("Email =", email);
        let role = await User.findOne({ email }).select({ role : 1 });
        if(role.role != "HR") {
            return res.status(400).send("Sorry, Holiday's can only be added by HR's");
        }
        const body = {
            event : req.body.event, 
            eventDate : new Date(req.body.eventDate), 
            eventType : req.body.eventType
        }

        if(!body.event || !body.eventDate || !body.eventType) {
            return res.status(400).send("Please provide event, it's date and it's type");
        }

        const result = await service.addHolidayIntoCollection(body);

        return res.status(201).send(result);
    }
    catch(error) {
        res.status(400).send(`${error}`);
    }
};




//* This function is used to show all public holidays  
async function showHolidays(req, res) {
    try {
        const holidays = await service.getPublicHolidays();
        return res.status(200).send(holidays);
    }
    catch(error) {
        res.status(400).send(`${error}`);
    }
};




//* This function is used to update a specific holiday 
async function updateHoliday(req, res) {
    try {
        let email = req.email;
        console.log("Email =", email);
        let role = await User.findOne({ email }).select({ role : 1 });
        if(role.role != "HR") {
            return res.status(400).send("Sorry, Holiday's can only be updated by HR's");
        }
        let id = req.params.id;
        let toUpdate = req.body;

        const updatedResult = await service.updateSpecificHoliday(id, toUpdate);
        console.log('updatedResult :', updatedResult);
        return res.status(200).send(updatedResult);
    }
    catch(error) {
        res.status(400).send(`${error}`);
    }
};





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



//* Export 
module.exports = {
    createNewUser, 
    loginUser, 
    showAllUsers, 
    applyLeave,
    showLeaves,
    addHoliday, 
    showHolidays, 
    updateHoliday,
    takeActionOnLeaveRequest
};