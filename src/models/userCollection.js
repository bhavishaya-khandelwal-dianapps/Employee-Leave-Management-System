const mongoose = require("mongoose");
const validator = require("validator");


//* Define "user" collection schema  
const userSchema = new mongoose.Schema({
    name : {
        type : String, 
        required : true,
        trim : true
    },
    role : {
        type : String, 
        required : true, 
        trim : true, 
        uppercase : true  
    }, 
    designation : {
        type : String, 
        required : true, 
        trim : true, 
    }, 
    phoneNumber : {
        type : String, 
        required : true, 
        trim : true,
        validate(value) {
            if(value.length < 10 || value.length > 10) throw new Error("Your phone number is invalid");
        }
    },
    age : {
        type : Number, 
        required : true, 
        validate(value) {
            if(value < 18 || value >= 90) {
                throw new Error("Please enter valid age");
            } 
        }
    },
    gender : {
        type : String, 
        required : true, 
        trim : true
    },
    availableLeaves : {
        type : String, 
        required : true, 
        trim : true,
        default : "2"
    },
    requestedLeaves : {
        type : String, 
        required : true,
        trim : true, 
        default : "0"
    },
    approvedLeaves : {
        type : String, 
        required : true,
        trim : true,  
        default : "0"
    }, 
    rejectedLeaves : {
        type : String, 
        required : true,
        trim : true,  
        default : "0"
    },
    email : {
        type : String, 
        required : true,
        trim : true,  
        unique : true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Your email is not valid");
            }
        }
    }, 
    password : {
        type : String, 
        required : true, 
    }
}, { 
    timestamps : true 
});




//* Now, we are going to create a model / collection 
const User = new mongoose.model("User", userSchema);



//* Export this collection  
module.exports = User;