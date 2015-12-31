var dateRegex = /(\d{4})[._-](\d{2})[-_.](\d{2})/;


function getDate(imageFile) {
    var matches = dateRegex.exec(imageFile),
        retDate,
        year,
        month,
        day;

    if (matches) {
        year = matches[1];
        month = matches[2] - 1; // zero-based
        day = matches[3];

        retDate = new Date(year, month, day);
    }

    return retDate;
}


module.exports = {
    getDate: getDate
};