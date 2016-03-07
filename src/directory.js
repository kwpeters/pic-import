var fs          = require("fs-extra"),
    path        = require("path"),
    q           = require("q"), // todo: Replace q with es6-promise polyfill
    S           = require("string");

var Directory = (function () {
    "use strict";

    /**
     * Constructs a new Directory.
     *
     * @class
     * @classdesc Represents a directory in the filesystem
     *
     * @param {...Directory|string} dirPath - The directory.  Multiple arguments will be
     * joined using path.join().  Any trailing directory separators will be removed.
     */
    function Directory(dirPath) {

        var pathHelpers = require("./pathHelpers");

        var priv = {
            dirPath: pathHelpers.reducePathParts(Array.prototype.slice.call(arguments))
        };

        // Remove trailing directory seperator characters.
        while (S(priv.dirPath).endsWith(path.sep)) {
            priv.dirPath = priv.dirPath.slice(0, -1);
        }


        /**
         * Returns the path that this Directory object represents.
         * @method
         * @returns {string} The directory path
         */
        this.toString = function directoryToString() {
            return priv.dirPath;
        };


        /**
         * Returns the absolute path of this directory.  This does not guarantee that this
         * directory exists.
         * @method
         * @returns {string} The absolute path of this directory
         */
        this.absPath = function absPath() {
            return path.resolve(priv.dirPath);
        };


        /**
         * Determines whether this Directory is equal to the specified directory.
         * @method
         * @param {Directory} other - The Directory to comppare against
         * @returns {boolean} true if the directories represent the same directory path.
         * false otherwise.
         */
        this.equals = function (other) {
            return this.absPath() === other.absPath();
        };


        /**
         * Splits this directory's path using the operating system's directory
         * separator.
         * @method
         * @returns {string[]} The parts of this directory's path
         */
        this.split = function split() {
            return priv.dirPath.split(path.sep);
        };


        /**
         * Gets a promise for the subdirectories present in this directory.
         * @method
         * @returns {Promise} A promise for an array of Directory objects representing
         * the subdirectories of this directory.  If an error occurs, the promise is
         * rejected.
         */
        this.getSubdirectories = function getSubdirectories() {
            // Convert these Node.js functions to return a promise.
            var readdir = q.nfbind(fs.readdir),
                stat    = q.nfbind(fs.stat);

            return readdir(priv.dirPath)
                .then(
                    function (dirEntries) {
                        // Convert to full paths.
                        return dirEntries.map(
                            function (curDirEntry) {
                                return path.join(priv.dirPath, curDirEntry);
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
                                    return new Directory(curDirInfo.dirEntry);
                                }
                            );
                    }
                );
        };


        /**
         * Gets the subdirectories present in this directory.
         * @method
         * @returns {Directory[]} An array of Directory objects representing the
         * subdirectories of this directory.  If an error occurs, the promise is rejected.
         */
        this.getSubdirectoriesSync = function getSubdirectoriesSync() {
            var dirEntries = fs.readdirSync(priv.dirPath);
            dirEntries = dirEntries.map(function (curDirEntry) {
                return path.join(priv.dirPath, curDirEntry);
            });
            dirEntries = dirEntries.map(function (curDirEntry) {
                var stats = fs.statSync(curDirEntry);
                return {
                    dirEntry: curDirEntry,
                    stats: stats
                };
            });
            dirEntries = dirEntries.filter(function (curDirEntry) {
                return curDirEntry.stats.isDirectory();
            });
            dirEntries = dirEntries.map(function (curDirEntry) {
                return new Directory(curDirEntry.dirEntry);
            });
            return dirEntries;
        };


        /**
         * Checks to see if this directory exists.
         * @method
         * @returns {Promise} A promise that is fulfilled with the directory's stats if it
         * exists.  It is resolved with false otherwise.
         */
        this.exists = function exists() {
            var dfd = q.defer();

            fs.stat(priv.dirPath, function (err, stats) {
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
         * @method
         * @returns {fs.Stats|boolean} If the directory exists, its fs.Stats object is
         * returned.  If the directory does not exist, false is returned.
         */
        this.existsSync = function () {
            var stats;

            try {
                stats = fs.statSync(priv.dirPath);
            }
            catch (ex) {
                return false;
            }

            return stats.isDirectory() ? stats : false;
        };


        /**
         * Ensures that this directory exists.  If it does not, it is created.
         * @method
         * @returns {Promise} A promise that is fulfilled once the directory exists.
         */
        this.ensureExists = function () {
            var dfd = q.defer();

            fs.ensureDir(priv.dirPath, function (err) {
                if (err) {
                    dfd.reject(err);
                } else {
                    dfd.resolve();
                }
            });

            return dfd.promise;
        };


        /**
         * Ensures that this directory exists.  If it does not, it is created.
         * @method
         */
        this.ensureExistsSync = function () {
            fs.ensureDirSync(priv.dirPath);
        };


        /**
         * Deletes the contents of this directory.
         * @method
         * @returns {Promise} A promise that is fulfilled (with undefined) when this
         * directory is successfully emptied.  The promise is rejected with if an error
         * occurs.
         */
        this.empty = function () {
            var dfd = q.defer();

            fs.emptyDir(priv.dirPath, function (err) {
                if (err) {
                    dfd.reject(err);
                    return;
                }

                dfd.resolve();
            });

            return dfd.promise;
        };


        /**
         * Deletes the contents of this directory.
         * @method
         */
        this.emptySync = function () {
            fs.emptyDirSync(priv.dirPath);
        };

    }


    return Directory;
})();


module.exports = Directory;
