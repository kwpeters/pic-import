var S              = require("string"),
    Datestamp      = require("./datestamp"),
    datestampRegex = /(\d{4})[-_](\d{2})[-_](\d{2})/;


var DatestampDir = (function () {
    "use strict";

    /**
     * Constructs a new DatestampDir.
     *
     * @class
     * @classdesc Represents a directory that is named using a datestamp
     */
    function DatestampDir() {

        // Data members
        // this.name = 'Kevin';
    }

    // Member functions
    // DatestampDir.prototype.myMethod = function () { };


    /**
     * Tests whether the specified path contains a datestamp.
     * @static
     * @param {string} path - The path to test
     * @returns {string|null} null if the path does not contain a datestamp.  A string
     * containing a normalized version of the datestamp if one is was found (in the
     * form yyyy-mm-dd).
     */
    DatestampDir.test = function (path) {
        var match = datestampRegex.exec(path),
            year,
            month,
            day;

        if (!match) {
            return null;
        }

        year  = match[1];
        month = match[2];
        day   = match[3];

        return new Datestamp.fromYMD(year, month, day);
    };

    return DatestampDir;
})();


module.exports = DatestampDir;