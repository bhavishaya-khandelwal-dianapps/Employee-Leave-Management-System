const validator = require("validator");


async function validateAllFields(obj) {
    const {name, role, designation, phoneNumber, age, gender, email, password } = obj;

    if(!name || !role || !designation || !phoneNumber || !age || !gender || !email || !password) return -1;
    
    //* Verify age 
    if(age < 18 || age >= 90) return 0; 


    //* Verify phone number
    if(phoneNumber.length < 10 || phoneNumber.length > 10) return 0; 


    //* Verify email  
    if(!validator.isEmail(email)) return 0; 


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
}


module.exports = {
    validateAllFields
}