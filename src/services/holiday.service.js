const Holiday = require("../models/holiday.model.js");


//* Add holiday to the collection 
async function saveHoliday(body) {
    const newHoliday = new Holiday(body);
    const saveNewHoliday = await newHoliday.save();
    if(!saveNewHoliday) throw new Error("Something went wrong, holiday not added");
    return saveNewHoliday;
};




//* Retrieve all the public holidays  
async function retrievePublicHolidays() {
    const publicHolidays = await Holiday.find({});
    if(publicHolidays.length == 0) throw new Error("OOPs, no holiday found");
    return publicHolidays;
};




//* Update holiday using id  
async function modifyHolidayById(id, toUpdate) {
    let result = await Holiday.findByIdAndUpdate({ _id : id }, { $set : toUpdate }, { new : true });
    if(!result) throw new Error("Sorry, event not found with given id");
    return result;
};




async function retrieveHolidayDates() {
    const holidayDates = await Holiday.find({ }).select({ eventDate : 1 });
    return holidayDates;
};


module.exports = {
    retrievePublicHolidays,
    saveHoliday,
    modifyHolidayById,
    retrieveHolidayDates
}