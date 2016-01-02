var S = require("string");

var Datestamp = (function () {
    "use strict";

    /**
     * Constructs a new Datestamp.
     *
     * @class
     * @classdesc Represents a datestamp string as used throughout this program.
     * @param {Date} date - The Date for the datestamp
     */
    function Datestamp(date) {

        var priv = {date: date};

        /**
         * Returns a string representation of this datestamp.
         * @method
         * @returns {string} A string representation of this datestamp instance
         */
        this.toString = function datestampToString() {
            return priv.date.getFullYear()                      + "-" +
                   S(priv.date.getMonth() + 1).padLeft(2, '0').s + "-" +
                   S(priv.date.getDate()).padLeft(2, '0').s;
        };

    }

    return Datestamp;
})();


/**
 * Creates a Datestamp from a year, month and day
 * @param {number} year - The year
 * @param {number} month - The month (1-12)
 * @param {number} day - The day (1-31)
 * @returns {Datestamp} The corresponding Datestamp instance
 */
Datestamp.fromYMD = function (year, month, day) {
    "use strict";
    return new Datestamp(new Date(
        year,
        month - 1,  // convert from 1-based to 0-based
        day));
};


module.exports = Datestamp;