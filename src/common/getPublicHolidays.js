const Holiday = require("../models/holidayCollection.js");


async function getPublicHolidaysArray() {
    const result = await Holiday.find({ }).select({ eventDate : 1 });
    return result;
};


module.exports = {
    getPublicHolidaysArray
};