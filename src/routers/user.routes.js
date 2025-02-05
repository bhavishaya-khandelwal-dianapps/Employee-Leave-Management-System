const express = require("express");
const userRouter = express.Router();
const auth = require("../middlewares/auth.middleware.js");
const userController = require("../controllers/user.controller.js");


//* List all employees, hr's and managers (make sure of hierarchy)
userRouter.get("/show", auth.verifyToken, userController.listAllUsers);

//* Export userRouter 
module.exports = userRouter;