const express = require("express");
const holidayRouter = express.Router();
const auth = require("../middlewares/auth.middleware.js");
const holidayController = require("../controllers/holiday.controller.js");


//* Add public holiday, and it can only added by HR's 
holidayRouter.post("/add/holiday", auth.verifyToken, holidayController.createHoliday);

//* Show holidays , anybody can see public holidays 
holidayRouter.get("/holidays", auth.verifyToken, holidayController.listHolidays);

//* Update holiday, and it can only updated by HR's
holidayRouter.patch("/update/holiday/:id", auth.verifyToken, holidayController.modifyHolidayRecord);


//* Export holidayRouter 
module.exports = holidayRouter;