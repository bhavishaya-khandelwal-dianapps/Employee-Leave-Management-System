const holidayService = require("../services/holiday.service.js");
const userService = require("../services/user.service.js");


//* THis function is used to add public holiday  
async function createHoliday(req, res) {
    try {
        let email = req.email;

        let user = await userService.getUserByEmail(email);
        if(user.role == "EMPLOYEE" || user.role == "MANAGER") return res.status(400).send("Sorry, you don't have permission to add holiday");


        if(!req.body.event || !req.body.eventDate || !req.body.eventType) {
            return res.status(400).send("Please provide event, it's date and it's type");
        }

        const newHoliday = await holidayService.saveHoliday(req.body);

        return res.status(201).send(newHoliday);
    }
    catch(error) {
        res.status(400).send(`${error}`);
    }
};




//* This function is used to show all public holidays  
async function listHolidays(req, res) {
    try {
        const holidays = await holidayService.retrievePublicHolidays();
        return res.status(200).send(holidays);
    }
    catch(error) {
        res.status(400).send(`${error}`);
    }
};




//* This function is used to update a specific holiday 
async function modifyHolidayRecord(req, res) {
    try {
        let email = req.email;

        let user = await userService.getUserByEmail(email);
        if(user.role == "EMPLOYEE" || user.role == "MANAGER") return res.status(400).send("Sorry, you don't have permission to modify holiday");

        let id = req.params.id;
        let toUpdate = req.body;
        if(Object.getOwnPropertyNames(toUpdate).length === 0) {
            return res.status(400).send("Please provide some fields to update");
        }

        const updatedHoliday = await holidayService.modifyHolidayById(id, toUpdate);
        return res.status(200).send({
            message : "Updated successfully",
            updatedHoliday
        });
    }
    catch(error) {
        res.status(400).send(`${error}`);
    }
};



module.exports = {
    createHoliday,
    listHolidays,
    modifyHolidayRecord
}