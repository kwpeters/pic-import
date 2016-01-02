var Directory    = require("./directory"),
    DatestampDir = require("./datestampDir");

//region Helper Functions

/**
 * Creates a map in which datestamps are the keys and the values are the subdirectories
 * within libraryDir corresponding to those dates.
 *
 * @param {string} libraryDir - The library directory to be analyzed
 * @returns {Promise} A promise for the generated map
 */
function createDateDirMap(libraryDir) {
    "use strict";

    var libDir = new Directory(libraryDir),
        subdirs;

    subdirs = libDir.getSubdirectories()
        .then(function (subdirs) {
            // We are only concerned with the subdirectories that have a date in them.
            return subdirs.reduce(
                function (prev, curSubdir) {
                    var datestamp = DatestampDir.test(curSubdir);
                    if (datestamp) {
                        prev[datestamp.toString()] = curSubdir;
                    }

                    return prev;
                },
                {}
            );
        })
        .done(
            function (dateDirMap) {
                console.log("Done indexing photo library.  Datestamped folders:",
                    Object.keys(dateDirMap).length
                );
                return dateDirMap;
            }
        );
}



//endregion


var PhotoLibrary = (function () {
    "use strict";

    /**
     * Constructs a new PhotoLibrary.
     *
     * @class
     * @classdesc Represents a photo library
     *
     * @param {string} rootDir - The root directory of the photo library.  If the
     * specified directory does not exist, an exception will be thrown.
     */
    function PhotoLibrary(rootDir) {

        if (!Directory.isDirectory(rootDir)) {
            throw new Error("Directory does not exist:" + rootDir);
        }

        var priv = {
            rootDir:     rootDir,
            dateDirMapP: createDateDirMap(rootDir)
        };

        this.import = function importPhoto(photoPath) {

        };
    }

    return PhotoLibrary;
})();


module.exports = PhotoLibrary;