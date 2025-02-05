const express = require("express");
const leaveRouter = express.Router();
const auth = require("../middlewares/auth.middleware.js");
const leaveController = require("../controllers/leave.controller.js");


//* Here we are creating apply leave  
leaveRouter.post("/apply/leave", auth.verifyToken, leaveController.submitLeaveRequest);


//* Show leave request of employees to HR and leave request of HR's to Managers
leaveRouter.get("/showleave", auth.verifyToken, leaveController.displayLeaves);


//* Export leaveRouter  
module.exports = leaveRouter;