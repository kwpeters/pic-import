var fs   = require("fs"),
    path = require("path"),
    q    = require("q");

var Directory = (function () {
    "use strict";

    function Directory(dir) {

        var priv = {dir: dir};

        /**
         * Returns the path that this Directory object represents.
         * @method
         * @returns {string} The directory path
         */
        this.toString = function directoryToString() {
            return priv.dir;
        };


        /**
         * Splits this directory's path using the operating system's directory
         * separator.
         * @method
         * @returns {string[]} The parts of this directory's path
         */
        this.split = function split() {
            return priv.dir.split(path.sep);
        };


        /**
         * Gets a promise for the subdirectories present in this directory.
         * @method
         * @returns {Promise} A promise for the array of subdirectories
         * if resolved and an Error if if rejected.
         */
        this.getSubdirectories = function getSubdirectories() {
            // Convert these Node.js functions to return a promise.
            var readdir = q.nfbind(fs.readdir),
                stat    = q.nfbind(fs.stat);

            return readdir(priv.dir)
                .then(
                    function (dirEntries) {
                        // Convert to full paths.
                        return dirEntries.map(
                            function (curDirEntry) {
                                return path.join(priv.dir, curDirEntry);
                            });
                    }
                )
                .then(
                    function (dirEntries) {
                        // Map each directory entry into an object containing
                        // the directory entry's name and its stats.
                        var promises = dirEntries.map(
                            function (curDirEntry) {
                                return stat(curDirEntry)
                                    .then(
                                        function (stats) {
                                            return {
                                                dirEntry: curDirEntry,
                                                stats:    stats
                                            };
                                        });
                            });
                        return q.all(promises);
                    }
                )
                .then(
                    function (dirEntryInfos) {
                        // Keep only the directory entries that are directories.
                        return dirEntryInfos
                            .filter(
                                function (curDirEntryInfo) {
                                    return curDirEntryInfo.stats.isDirectory();
                                }
                            );
                    }
                )
                .then(
                    function (dirInfos) {
                        // Return only the dirEntry property to return to the
                        // caller.
                        return dirInfos
                            .map(
                                function (curDirInfo) {
                                    return curDirInfo.dirEntry;
                                }
                            );
                    }
                );
        };


        /**
         * Checks to see if this directory exists.
         * @method
         * @returns {Promise} A promise that is fulfilled with the directory's stats if it
         * exists.  It is resolved with false otherwise.
         */
        this.exists = function exists() {
            return Directory.exists(priv.dir);
        };


        /**
         * Checks to see if the specified directory exists.
         * @returns {fs.Stats|boolean} If the directory exists, its fs.Stats object is
         * returned.  If the directory does not exist, false is returned.
         */
        this.existsSync = function () {
            return Directory.existsSync(priv.dir);
        };

    }

    // Static functions

    /**
     * Checks to see if the specified directory exists.
     * @param {string} path - The path to the directory in question
     * @returns {Promise} A promise that is resolved with the directory's stats if it
     * exists.  It is fulfilled with false otherwise.
     */
    Directory.exists = function exists(path) {
        var dfd = q.defer();

        fs.stat(path, function (err, stats) {
            if (err) {
                dfd.resolve(false);
                return;
            }

            if (stats.isDirectory()) {
                dfd.resolve(stats);
            } else {
                dfd.resolve(false);
            }
        });

        return dfd.promise;
    };


    /**
     * Checks to see if the specified directory exists.
     * @param {string} path - The path to the directory in question
     * @returns {fs.Stats|boolean} If the directory exists, its fs.Stats object is
     * returned.  If the directory does not exist, false is returned.
     */
    Directory.existsSync = function (path) {
        var stats;

        try {
            stats = fs.statSync(path);
        }
        catch (ex) {
            return false;
        }

        return stats.isDirectory() ? stats : false;
    };


    return Directory;
})();


module.exports = Directory;