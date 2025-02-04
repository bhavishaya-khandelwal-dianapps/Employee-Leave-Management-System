const mongoose = require("mongoose");
const URL = process.env.URL;


//* Connect with mongoDB server  
mongoose.connect(URL)
.then(() => {
    console.log(`Connection successful, go ahead...`);
})
.catch((error) => {
    console.log(`Error occur while connecting to mongoDB server and the error = ${error}`);
});