var fs   = require("fs"),
    path = require("path"),
    q    = require("q");

var Directory = (function () {
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
                        return dirEntryInfos.filter(
                            function (curFileInfo) {
                                return curFileInfo.stats.isDirectory();
                            });
                    }
                )
                .then(
                    function (dirInfos) {
                        // Return only the dirEntry property to return to the
                        // caller.
                        return dirInfos.map(
                            function (curDirInfo) {
                                return curDirInfo.dirEntry;
                            });
                    }
                );
        };

    }

    // Static functions

    /**
     * Determines whether the specified path is a directory.
     * @static
     * @param {string} path - The path to test
     * @returns {Promise} A promise for a boolean indicating whether path is the path
     * to a directory.
     */
    Directory.isDirectory = function (path) {
        var stat = q.nfbind(fs.stat);

        return stat(path)
            .then(function (stats) {
                return stats.isDirectory();
            });
    };

    return Directory;
})();


module.exports = Directory;