var fs   = require("fs-extra"),
    path = require("path"),
    q    = require("q"),
    Directory = require("./directory"),
    pathHelpers = require("./pathHelpers");

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
            filePath: pathHelpers.reducePathParts(Array.prototype.slice.call(arguments))
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
         * Splits this file's path into 3 parts: directory (including trailing path
         * seperator), basename, and extension (including initial ".").
         * @method
         * @returns {string[]} The 3 parts of the path.  The item at index 0 is the
         * directory (with a trailing directory seperator), index 1 is the basename and
         * index 2 is the extension (including the initial ".").  If the file is a
         * dotfile, the basename index will include the file's name.
         */
        this.split = function () {

            var dirName = path.dirname(priv.filePath) + path.sep,
                extName = path.extname(priv.filePath),
                baseName = path.basename(priv.filePath, extName);

            return [dirName, baseName, extName];
        };


        /**
         * Gets a Directory object representing the directory portion of this file's path.
         * @method
         * @returns {Directory} A directory object representing the directory portion of
         * this file's path.
         */
        this.directory = function () {
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


        /**
         * Checks to see if the specified file exists.
         * @returns {fs.Stats|boolean} If the file exists, its fs.Stats object is
         * returned.  If the file does not exist, false is returned.
         */
        this.existsSync = function () {
            var stats;

            try {
                stats = fs.statSync(priv.filePath);
            }
            catch (ex) {
                return false;
            }

            return stats.isFile() ? stats : false;
        };


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
        this.copy = function(destDirOrFile, destFilename) {
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
        this.copySync = function (destDirOrFile, destFilename) {
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
         * Writes the specified text to this file.
         * @param {string} text - The text to be written to this file
         * @returns {Promise} A promise that is fulfilled (with undefined) when the
         * write operation finishes.  It is rejected with an Error when an error occurs.
         */
        this.write = function (text) {
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
         * @param {string} text - The text to be written to this file
         * @returns {undefined} Always returns undefined
         */
        this.writeSync = function (text) {
            fs.outputFileSync(priv.filePath, text);
        };


        this.read = function () {
            var dfd = q.defer();

            fs.readFile(priv.filePath, {encoding: "utf8"}, function (err, data) {
                if (err) {
                    dfd.reject(err);
                    return;
                }

                dfd.resolve(data);
            });

            return dfd.promise;
        };


        // todo: Add readSync()
    }


    return File;
})();


module.exports = File;