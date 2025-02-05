const validator = require("validator");


function verifyPassword(password) {
    //* Verify password 
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let symbols = "!@#$%^&*";
    let digits = "0123456789";
    //* Check chars 
    let isCharPresent = false;
    for(let value of chars) {
        if(password.includes(value)) {
            isCharPresent = true; 
            break;
        }
    }
    if(isCharPresent == false) return 0; 

    //* Check digit 
    let isdigitPresent = false;
    for(let value of digits) {
        if(password.includes(value)) {
            isdigitPresent = true;
            break;
        }
    }
    if(isdigitPresent == false) return 0;

    //* Check symbol 
    let isSymbolPresent = false;
    for(let value of symbols) {
        if(password.includes(value)) {
            isSymbolPresent = true;
            break;
        }
    }
    if(isSymbolPresent == false) return 0;
    return 1;
};


async function validateRegistrationFields(body) {

    //* Check that is user missed any field 
    if(!body.name || !body.role || !body.designation || !body.phoneNumber || !body.age || !body.gender || !body.email || !body.password) return -1;
    
    //* Verify age 
    if(body.age < 18 || body.age >= 90) return 0; 


    //* Verify phone number
    if(isNaN(body.phoneNumber) || body.phoneNumber.length < 10 || body.phoneNumber.length > 10) return 0; 


    //* Verify email  
    if(!validator.isEmail(body.email)) return 0; 


    //* Verify Password  
    if(verifyPassword(body.password) == 0) return 0; 

    return 1;
};



async function validateLoginFields(body) {
    //* Check is user missed any field 
    if(!body.email || !body.password) return -1;

    //* Verify email 
    if(!validator.isEmail(body.email)) return 0; 

    //* Verify Password  
    if(verifyPassword(body.password) == 0) return 0;

    return 1;
};



module.exports = {
    validateRegistrationFields, 
    validateLoginFields
}