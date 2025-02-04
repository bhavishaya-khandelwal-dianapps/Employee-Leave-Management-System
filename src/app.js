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
const router = require("./routers/routes.js");


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
app.use(router);




//* Listen the express server 
const server = app.listen(PORT, () => {
    console.log(`Server is listening on PORT number ${PORT}`);
});