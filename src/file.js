var fs = require("fs"),
    q  = require("q");

var File = (function () {
    "use strict";

    /**
     * Constructs a new File.
     *
     * @class
     * @classdesc Represents a file in the filesystem
     * @param {string} path - The file's path
     */
    function File(path) {
        var priv;

        if (!path) {
            throw new Error("File not specified.");
        }

        priv = {
            path: path
        };

        /**
         * Returns a string representation of this file.
         * @method
         * @returns {string} A string representation of this file
         */
        this.toString = function toString() {
            return priv.path;
        };

        /**
         * Checks to see if this file exists.
         * @method
         * @returns {Promise} A promise that is fulfilled with the file's stats if it
         * exists.  It is resolved with false otherwise.
         */
        this.exists = function exists() {
            return File.exists(priv.path);
        };

        /**
         * Checks to see if the specified file exists.
         * @returns {fs.Stats|boolean} If the file exists, its fs.Stats object is
         * returned.  If the file does not exist, false is returned.
         */
        this.existsSync = function () {
            return File.existsSync(priv.path);
        };

    }

    /**
     * Checks to see if the specified file exists.
     * @param {string} path - The path to the file in question
     * @returns {Promise} A promise that is resolved with the file's stats if it
     * exists.  It is fulfilled with false otherwise.
     */
    File.exists = function exists(path) {
        var dfd = q.defer();

        fs.stat(path, function (err, stats) {
            if (err) {
                dfd.resolve(false);
                return;
            }

            if (stats.isFile()) {
                dfd.resolve(stats);
            } else {
                dfd.resolve(false);
            }
        });

        return dfd.promise;
    };

    /**
     * Checks to see if the specified file exists.
     * @param {string} path - The path to the file in question
     * @returns {fs.Stats|boolean} If the file exists, its fs.Stats object is returned.
     * If the file does not exist, false is returned.
     */
    File.existsSync = function (path) {
        var stats;

        try {
            stats = fs.statSync(path);
        }
        catch (ex) {
            return false;
        }

        return stats.isFile() ? stats : false;
    };

    return File;
})();


module.exports = File;