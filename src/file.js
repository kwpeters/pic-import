var fs   = require("fs"),
    path = require("path"),
    q    = require("q");

var File = (function () {
    "use strict";

    /**
     * Constructs a new File.
     *
     * @class
     * @classdesc Represents a file in the filesystem
     * @param {...string} filePath - The file's filePath.  If multiple values are given,
     * path.join() is used to join them.
     */
    function File(filePath) {
        var priv;

        if (!filePath) {
            throw new Error("File not specified.");
        }

        priv = {
            filePath: path.join.apply(null, arguments)
        };

        
        /**
         * Returns a string representation of this file.
         * @method
         * @returns {string} A string representation of this file
         */
        this.toString = function toString() {
            return priv.filePath;
        };


        /**
         * Checks to see if this file exists.
         * @method
         * @returns {Promise} A promise that is fulfilled with the file's stats if it
         * exists.  It is resolved with false otherwise.
         */
        this.exists = function exists() {
            var dfd = q.defer();

            fs.stat(priv.filePath, function (err, stats) {
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
         * @returns {fs.Stats|boolean} If the file exists, its fs.Stats object is
         * returned.  If the file does not exist, false is returned.
         */
        this.existsSync = function () {
            var stats;

            try {
                stats = fs.statSync(filePath);
            }
            catch (ex) {
                return false;
            }

            return stats.isFile() ? stats : false;
        };

    }


    return File;
})();


module.exports = File;