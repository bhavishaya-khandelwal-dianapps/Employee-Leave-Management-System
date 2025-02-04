function isDateInRange(dateToCheck, startDate, endDate) {

    //* Check if the date is between start and end
    return (dateToCheck >= startDate && dateToCheck <= endDate);

}



module.exports = {
    isDateInRange
}