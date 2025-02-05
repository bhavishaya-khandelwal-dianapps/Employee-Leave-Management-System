const express = require("express");
const app = express();
const { config } = require("dotenv");
config();
const logger = require("./utilities/logger.js");
const morgan = require("morgan");
const PORT = process.env.PORT;


//* Connect with mongoDB server  
require("./config/connection.js");


//* Require routes.js file 
// const actionRouter = require("./routers/action.routes.js");
const authRouter = require("./routers/auth.routes.js");
const holidayRouter = require("./routers/holiday.routes.js");
// const leaveRouter = require("./routers/leave.routes.js");
const userRouter = require("./routers/user.routes.js");


//* Define morgan format  
const morganFormat = ":method :url :status :response-time ms";



//* Necessary middleware to use custom logger 
app.use(morgan(morganFormat, {
    stream : {
        write : (message) => {
            const logObject = {
                method : message.split(' ')[0], 
                url : message.split(' ')[1],
                status : message.split(' ')[2], 
                responseTime : message.split(' ')[3]
            };
            logger.info(JSON.stringify(logObject));
        }
    }
}));



//* Some necessary middlewares  
app.use(express.urlencoded({
    extended : true
}));

app.use(express.json());


//* Define router middleware 
// app.use(actionRouter);
app.use(authRouter);
app.use(holidayRouter);
// app.use(leaveRouter);
app.use(userRouter);



//* Listen the express server 
const server = app.listen(PORT, () => {
    console.log(`Server is listening on PORT number ${PORT}`);
});