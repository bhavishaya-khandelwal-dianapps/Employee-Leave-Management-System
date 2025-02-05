const mongoose = require("mongoose");



//* Creating leave record schema 
const leaveRecordSchema = new mongoose.Schema({
    userId: {
        type : String, 
        trim : true
    },
    email : {
        type : String, 
        required : true, 
        trim : true, 
    },
    role : {
        type : String, 
        trim : true, 
    },
    status : {
        type : String, 
        required : true,
        trim : true, 
        uppercase : true,
        default : "NULL"
    },
    startDate : {
        type : Date, 
        required : true, 
    },
    endDate : {
        type : Date, 
        required : true, 
    }, 
    leaveType : {
        type : String, 
        required : true, 
        trim : true,
        uppercase : true
    }, 
    reason : {
        type : String, 
        required : true, 
        trim : true 
    }, 
    shift : {
        type : String, 
        required : true, 
        trim : true,
        uppercase : true
    },
    leaveCount : {
        type : String,
        trim : true,  
    }
});



//* Creating "leaveRecord" collection 
const LeaveRecord = new mongoose.model("LeaveRecord", leaveRecordSchema);




//* Export "LeaveRecord" collection  
module.exports = LeaveRecord;