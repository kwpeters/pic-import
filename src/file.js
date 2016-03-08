var fs          = require("fs-extra"),
    path        = require("path"),
    q           = require("q"),
    Directory   = require("./directory"),
    pathHelpers = require("./pathHelpers");

var File = (function () {
    "use strict";

    /**
     * Constructs a new File.
     *
     * @class
     * @classdesc Represents a file in the filesystem
     * @param {...Directory|string} filePath - The file's filePath.  Multiple values may
     * be given, because pathHelpers.reducePathParts() is used to build the file's path.
     */
    function File(filePath) {
        var priv;

        if (!filePath) {
            throw new Error("File not specified.");
        }

        priv = {
            filePath: pathHelpers.reducePathParts(Array.prototype.slice.call(arguments))
        };


        /**
         * Returns a string representation of this file's path.
         * @method
         * @returns {string} A string representation of this file's path.
         */
        this.toString = function toString() {
            return priv.filePath;
        };


        /**
         * Returns the absolute path of this file.  This does not guarantee that this file
         * exists.
         * @method
         * @returns {string} The absolute path of this file
         */
        this.absPath = function () {
            return path.resolve(priv.filePath);
        };


        /**
         * Determines whether this File is equal to the specified File.
         * @method
         * @param {File} other - The File to comppare against
         * @returns {boolean} true if the files represent the same file path.
         * false otherwise.
         */
        this.equals = function equals(other) {
            return this.absPath() === other.absPath();
        };


        /**
         * Splits this file's path into 3 parts: directory (including trailing path
         * seperator), basename, and extension (including initial ".").
         * @method
         * @returns {string[]} The 3 parts of the path.  The item at index 0 is the
         * directory (with a trailing directory seperator), index 1 is the basename and
         * index 2 is the extension (including the initial ".").  If the file is a
         * dotfile, the basename index will include the file's name.
         */
        this.split = function split() {

            var dirName = path.dirname(priv.filePath) + path.sep,
                extName = path.extname(priv.filePath),
                baseName = path.basename(priv.filePath, extName);

            return [dirName, baseName, extName];
        };


        /**
         * Returns the file name part of this file's path
         * @method
         * @returns {string} The file name part of this file's path
         */
        this.getFileName = function getFileName() {
            var parts = this.split();
            return parts[1] + parts[2];
        };


        /**
         * Gets a Directory object representing the directory portion of this file's path.
         * @method
         * @returns {Directory} A directory object representing the directory portion of
         * this file's path.
         */
        this.directory = function directory() {
            var dirName = path.dirname(priv.filePath);
            return new Directory(dirName);
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
        this.stats = this.exists;


        /**
         * Checks to see if the specified file exists.
         * @returns {fs.Stats|boolean} If the file exists, its fs.Stats object is
         * returned.  If the file does not exist, false is returned.
         */
        this.existsSync = function existsSync() {
            var stats;

            try {
                stats = fs.statSync(priv.filePath);
            }
            catch (ex) {
                return false;
            }

            return stats.isFile() ? stats : false;
        };
        this.statsSync = this.existsSync;


        /**
         * Copies this file to the specified destination.
         * @method
         * @param {Directory|File} destDirOrFile - The destination directory or file name
         * @param {string} [destFilename] - If destDirOrFile is a Directory, this optional
         * parameter can specify the name of the destination file.  If not specified, the
         * file name of this file is used.
         * @returns {Promise} A promise that is resolved with the destination File object
         * if successful.  This promise is rejected if an error occurred.
         */
        this.copy = function copy(destDirOrFile, destFilename) {
            var dfd = q.defer(),
                srcFileParts = this.split(),
                destFile;

            if (destDirOrFile instanceof File) {
                // The caller has specified the destination directory and file name in the
                // form of a File.

                destFile = destDirOrFile;
            } else if (destDirOrFile instanceof Directory) {
                // The caller has specified the destination directory and optionally a
                // new file name.

                if (destFilename === undefined) {
                    destFile = new File(destDirOrFile.toString(), srcFileParts[1] + srcFileParts[2]);
                } else {
                    destFile = new File(destDirOrFile.toString(), destFilename);
                }
            }

            fs.copy(priv.filePath, destFile.toString(), function (err) {
                if (err) {
                    dfd.reject(err);
                    return;
                }

                dfd.resolve(destFile);
            });

            return dfd.promise;
        };


        /**
         * Copies this file to the specified destination.
         * @method
         * @param {Directory|File} destDirOrFile - The destination directory or file name
         * @param {string} [destFilename] - If destDirOrFile is a Directory, this optional
         * parameter can specify the name of the destination file.  If not specified, the
         * file name of this file is used.
         * @returns {File} A File object representing the destination file
         */
        this.copySync = function copySync(destDirOrFile, destFilename) {
            var srcFileParts = this.split(),
                destFile;

            if (destDirOrFile instanceof File) {
                // The caller has specified the destination directory and file name in the
                // form of a File.
                destFile = destDirOrFile;
            } else if (destDirOrFile instanceof Directory) {
                // The caller has specified the destination directory and optionally a new
                // file name.

                if (destFilename === undefined) {
                    destFile = new File(destDirOrFile.toString(), srcFileParts[1] + srcFileParts[2]);
                } else {
                    destFile = new File(destDirOrFile.toString(), destFilename);
                }
            }

            fs.copySync(priv.filePath, destFile.toString());
            return destFile;
        };


        /**
         * Moves this file to the specified destination.
         * @method
         * @param {Directory|File} destDirOrFile - The destination directory or file name
         * @param {string} [destFilename] - If destDirOrFile is a Directory, this optional
         * parameter can specify the name of the destination file.  If not specified, the
         * file name of this file is used.
         * @returns {Promise} A promise that is resolved with the destination File object
         * if successful.  This promise is rejected if an error occurred.
         */
        this.move = function move(destDirOrFile, destFilename) {
            var dfd = q.defer(),
                srcFileParts = this.split(),
                destFile;

            if (destDirOrFile instanceof File) {
                // The caller has specified the destination directory and file name in the
                // form of a File.
                destFile = destDirOrFile;
            } else if (destDirOrFile instanceof Directory) {
                // The caller has specified the destination directory and optionally a new
                // file name.

                if (destFilename === undefined) {
                    destFile = new File(destDirOrFile.toString(), srcFileParts[1] + srcFileParts[2]);
                } else {
                    destFile = new File(destDirOrFile.toString(), destFilename);
                }
            }

            fs.move(priv.filePath, destFile.toString(), {clobber: true}, function (err) {
                if (err) {
                    dfd.reject(err);
                    return;
                }

                dfd.resolve(destFile);
            });


            return dfd.promise;
        };


        /**
         * Moves this file to the specified destination.
         * @method
         * @param {Directory|File} destDirOrFile - The destination directory or file name
         * @param {string} [destFilename] - If destDirOrFile is a Directory, this optional
         * parameter can specify the name of the destination file.  If not specified, the
         * file name of this file is used.
         * @returns {File} A File object representing the destination file
         */
        this.moveSync = function moveSync(destDirOrFile, destFilename) {

            var srcFileParts = this.split(),
                destFile;

            if (destDirOrFile instanceof File) {
                // The caller has specified the destination directory and file name in the
                // form of a File.
                destFile = destDirOrFile;
            } else if (destDirOrFile instanceof Directory) {
                // The caller has specified the destination directory and optionally a new
                // file name.

                if (destFilename === undefined) {
                    destFile = new File(destDirOrFile.toString(), srcFileParts[1] + srcFileParts[2]);
                } else {
                    destFile = new File(destDirOrFile.toString(), destFilename);
                }
            }

            // There is no easy way to move a file using fs.  fs.renameSync() will not
            // work when crossing partitions or using a virtual filesystem that does not
            // support moving files.  As a fallback, we will copy the file and then delete
            // this file.
            this.copySync(destFile);
            fs.unlinkSync(priv.filePath);
            return destFile;
        };


        /**
         * Writes the specified text to this file.
         * @method
         * @param {string} text - The text to be written to this file
         * @returns {Promise} A promise that is fulfilled (with undefined) when the
         * write operation finishes.  It is rejected with an Error when an error occurs.
         */
        this.write = function write(text) {
            var dfd = q.defer();

            fs.outputFile(priv.filePath, text, function (err) {
                if (err) {
                    dfd.reject(err);
                    return;
                }

                dfd.resolve();
            });

            return dfd.promise;
        };


        /**
         * Writes the specified text to this file.
         * @method
         * @param {string} text - The text to be written to this file
         * @returns {undefined} Always returns undefined
         */
        this.writeSync = function (text) {
            fs.outputFileSync(priv.filePath, text);
        };


        /**
         * Reads the text from this file.
         * @method
         * @returns {Promise} A promise that is fulfilled with the text contents of this
         * file.  The promise is rejected with an error if an error is encountered.
         */
        this.read = function read() {
            var dfd = q.defer();

            fs.readFile(priv.filePath, {encoding: "utf8"}, function (err, text) {
                if (err) {
                    dfd.reject(err);
                    return;
                }

                dfd.resolve(text);
            });

            return dfd.promise;
        };


        /**
         * Reads the text from this file.
         * @method
         * @returns {string} The text contents of this file.
         */
        this.readSync = function readSync() {
            return fs.readFileSync(priv.filePath, {encoding: "utf8"});
        };

    }


    return File;
})();


module.exports = File;
