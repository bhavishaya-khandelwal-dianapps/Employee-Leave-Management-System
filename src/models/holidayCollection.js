const mongoose = require("mongoose");



//* Define "holiday" schema 
const holidaySchema = new mongoose.Schema({
    event : {
        type : String, 
        required : true, 
        trim : true, 
        uppercase : true
    }, 
    eventDate : {
        type : Date,
        required : true 
    }, 
    eventType : {
        type : String,
        required : true, 
        trim : true, 
        uppercase : true
    }
});



//* Create "holiday" collection 
const Holiday = new mongoose.model("Holiday", holidaySchema);



module.exports = Holiday;