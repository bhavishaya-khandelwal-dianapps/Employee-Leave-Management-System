const express = require("express");
const actionRouter = express.Router();

//* Now, HR can approve or reject any employee leave request and Manager can approve or reject any HR leave request  
actionRouter.patch("/leave/action/:id", authenticate.verifyToken, control.takeActionOnLeaveRequest);

//* Export actionRouter  
module.exports = actionRouter;