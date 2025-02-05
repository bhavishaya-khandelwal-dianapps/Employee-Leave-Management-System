const express = require("express");
const router = express.Router();


//* Require "tokenGeneration" function 
const authenticate = require("../middlewares/middleware.js");
const control = require("../controllers/controller.js");


//* Register a new user  
router.post("/register", control.createNewUser);



//* Login a registered user 
router.post("/login", control.loginUser);



//* List all users of a specific role 
router.get("/show/:role", authenticate.verifyToken, control.showAllUsers);



//* List all employees, hr's and managers (make sure of hierarchy)
router.get("/show", authenticate.verifyToken, control.showAllUsers);



//* Here we are creating apply leave  
router.post("/apply/leave", authenticate.verifyToken, control.applyLeave);



//* Show leave request of employees to HR and leave request of HR's to Managers
router.get("/showleave", authenticate.verifyToken, control.showLeaves);



//* Add public holiday, and it can only added by HR's 
router.post("/add/holiday", authenticate.verifyToken, control.addHoliday);



//* Show holidays , anybody can see public holidays 
router.get("/holidays", authenticate.verifyToken, control.showHolidays);



//* Update holiday, and it can only updated by HR's
router.patch("/update/holiday/:id", authenticate.verifyToken, control.updateHoliday);




//* Now, HR can approve or reject any employee leave request and Manager can approve or reject any HR leave request  
router.patch("/leave/action/:id", authenticate.verifyToken, control.takeActionOnLeaveRequest);




//* Exporting the router 
module.exports = router;