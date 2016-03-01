var DatestampDir = require("./datestampDir"),
    File         = require("./file"),
    Directory    = require("./directory");


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
            rootDir:           rootDir,
            dateDirMapPromise: createDateDirMap(rootDir)
        };


        /**
         * Imports the specified file into this library.
         * @method
         * @param {File} file - The file to import
         * @returns {Promise} A promise that is resolved with the imported File object if
         * the file is successfully imported.  The promise is rejected if an error occurs.
         */
        this.import = function importPhoto(file) {
            var filenameReader = require("./filenameReader"),
                Datestamp      = require("./datestamp"),
                exifReader     = require("./exifReader");

            // todo: Implement this.

            if (!(file instanceof File)) {
                throw new Error("Parameter is not a File.");
            }

            return file.exists()
                .then(function (fileStats) {
                    if (!fileStats) {
                        throw new Error("File does not exist: " + file.toString());
                    }
                })
                .then(function () {
                    // First, try to extract the file's creation date from the name.
                    var date = filenameReader.getDate(file.toString());
                    if (date) {
                        return new Datestamp(date);
                    }

                    // Next, try to read the file's creation date from the EXIF data.
                    return exifReader.getCreateDate(file.toString());
                })
                .then(function (datestamp) {

                    return priv.dateDirMapPromise
                        .then(
                            function (dateDirMap) {
                                var destFile;

                                if (dateDirMap[datestamp]) {
                                    // A directory corresponding to the imported file's
                                    // datestamp already exists.

                                    // If the source and destination paths are the same
                                    // then there is nothing to do.  This can happen
                                    // when the file we are importing is already inside
                                    // the photo library.
                                    destFile = new File(dateDirMap[datestamp], file.getFileName());
                                    if (file.equals(destFile)) {
                                        return destFile;
                                    } else {
                                        return file.move(dateDirMap[datestamp]);
                                    }
                                } else {

                                    // A directory for the datestamp does not exist.
                                    // Create it.

                                    var datestampedDir = new Directory(priv.rootDir, datestamp);
                                    return datestampedDir.ensureExists()
                                        .then(
                                            function () {
                                                var importedFile = file.move(datestampedDir);

                                                // Update the map for future use.
                                                dateDirMap[datestamp] = datestampedDir;

                                                return importedFile;
                                            }
                                        );
                                }
                            }
                        );
                });
        };
    }

    //region Helper Functions
    ////////////////////////////////////////////////////////////////////////////////


    /**
     * Creates a map in which Datestamps are the keys and the values are the subdirectories
     * within libraryDir corresponding to those dates.
     *
     * @param {Directory} libraryDir - The library directory to be analyzed
     * @returns {Promise} A promise for the generated map
     */
    function createDateDirMap(libraryDir) {

        return libraryDir.getSubdirectories()
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
            });
    }

    //endregion

    PhotoLibrary.createDateDirMap = createDateDirMap;

    return PhotoLibrary;
})();


module.exports = PhotoLibrary;
