var dateRegex = /(\d{4})[._-](\d{2})[-_.](\d{2})/;


/**
 * Attempts to extract a Date from the specified file's name.
 * @param {string} imageFile - The file whose name is to be used
 * @returns {Date|undefined} If successful, the extracted date.  undefined otherwise.
 */
function getDate(imageFile) {
    "use strict";

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
