const express = require("express");
const leaveRouter = express.Router();

//* Here we are creating apply leave  
leaveRouter.post("/apply/leave", authenticate.verifyToken, control.applyLeave);

//* Show leave request of employees to HR and leave request of HR's to Managers
leaveRouter.get("/showleave", authenticate.verifyToken, control.showLeaves);

//* Export leaveRouter  
module.exports = leaveRouter;