var exifReader   = require("./exifReader"),
    DatestampDir = require("./datestampDir"),
    File         = require("./file");

//region Helper Functions

/**
 * Creates a map in which datestamps are the keys and the values are the subdirectories
 * within libraryDir corresponding to those dates.
 *
 * @param {Directory} libraryDir - The library directory to be analyzed
 * @returns {Promise} A promise for the generated map
 */
function createDateDirMap(libraryDir) {
    "use strict";

    var subdirs;

    subdirs = libraryDir.getSubdirectories()
        .done(function (subdirs) {
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
        });
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
     * @param {Directory} rootDir - The root directory of the photo library.  If the
     * specified directory does not exist, an exception will be thrown.
     */
    function PhotoLibrary(rootDir) {

        if (!rootDir.existsSync()) {
            throw new Error("Directory does not exist:" + rootDir);
        }

        var priv = {
            rootDir:     rootDir,
            dateDirMapP: createDateDirMap(rootDir)
        };


        /**
         * Imports the specified file into this library.
         * @method
         * @param {File} file - The file to import
         * @returns {Promise} ReturnDescription
         */
        this.import = function importPhoto(file) {
            // todo: Implement this.

            if (!(file instanceof File)) {
                throw new Error("Parameter is not a File.");
            }

            return file.exists()
                .then(function (fileStats) {
                    if (!fileStats) {
                        throw new Error("File does not exist: " + file.toString());
                    }



                });


            //exifReader.getCreateDate(file);



        };
    }

    return PhotoLibrary;
})();


module.exports = PhotoLibrary;