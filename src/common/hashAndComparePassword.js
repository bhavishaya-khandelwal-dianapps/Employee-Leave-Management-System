const bcrypt = require("bcryptjs");



//* Hash the password 
async function hashThePassword(password) {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
};


//* Compare the passwords 
async function compareThePassword(password, strongPassword) {
    const isMatch = await bcrypt.compare(password, strongPassword);
    return isMatch;
};



module.exports = {
    hashThePassword, 
    compareThePassword
}