const express = require("express");
const actionRouter = express.Router();
const auth = require("../middlewares/auth.middleware.js");
const actionController = require("../controllers/action.controller.js");


//* Now, HR can approve or reject any employee leave request and Manager can approve or reject any HR leave request  
actionRouter.patch("/leave/action/:id", auth.verifyToken, actionController.respondToLeaveRequest);


//* Export actionRouter  
module.exports = actionRouter;