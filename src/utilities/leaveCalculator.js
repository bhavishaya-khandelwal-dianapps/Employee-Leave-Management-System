const Holiday = require("../models/holiday.model.js");



function countSaturdaysAndSundays(startDate, endDate, holidaysArray) {

    //* Initialize counters
    let saturdays = 0;
    let sundays = 0;
    let publicHolidays = 0;
  
    //* Loop through each day between the start and end dates
    while((startDate <= endDate)) {

        //* Public holiday logic goes from here 
        if(holidaysArray.includes(startDate.toString())) {
            publicHolidays++;
        }

        //* Saturday, sunday logic goes from here  
        let dayOfWeek = startDate.getDay(); //* 0 for Sunday, 6 for Saturday
        if (dayOfWeek === 6) {
            saturdays++; 
        } 
        else if (dayOfWeek === 0) {
            sundays++;
        }

        //* Move to the next day
        startDate = new Date(startDate.setDate(startDate.getDate() + 1)); //* Create a new date object
    }
  
    return { saturdays, sundays, publicHolidays };
}

  

function calculateLeaveCount(startDate, endDate, shift, publicHolidayArray) {

    let holidaysArray = [];
    for(let value of publicHolidayArray) {
        holidaysArray.push((value.eventDate).toString());
    }

    //* Calculate the difference in milliseconds
    const differenceInMilliseconds = endDate - startDate;

    //* Convert the difference from milliseconds to days
    const millisecondsInOneDay = 1000 * 60 * 60 * 24;
    const differenceInDays = differenceInMilliseconds / millisecondsInOneDay;
    

    let safeLeaves = countSaturdaysAndSundays(startDate, endDate, holidaysArray);
    let { saturdays, sundays, publicHolidays } = safeLeaves;

    let leaveCount = differenceInDays + 1;

    switch(shift) {
        case "FULL DAY" : 
            leaveCount = leaveCount - saturdays - sundays - publicHolidays;
            return leaveCount.toString();

        case "HALF DAY" :
            leaveCount = (parseFloat(leaveCount) * (0.5)) - (parseFloat(saturdays) * (0.5)) - (parseFloat(sundays) * (0.5)) - (parseFloat(publicHolidays) * (0.5));
            return leaveCount.toString();
    }

    return leaveCount;
}



module.exports = {
    calculateLeaveCount
}