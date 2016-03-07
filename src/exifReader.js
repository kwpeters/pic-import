var q         = require("q"), // todo: Replace q with es6-promise polyfill
    ExifImage = require("exif").ExifImage,
    Datestamp = require("./datestamp"),
    dateRegex = /(\d{4}):(\d{2}):(\d{2})/;


/**
 * Gets the creation date from an image file's EXIF data.
 * @param {string} imageFile - The file to be examined
 * @returns {Promise} A promise that will be resolved with a Datestamp if successful.
 * The promise will be rejected if an error occurred.
 */
function getCreateDate(imageFile) {
    "use strict";

    var dfd = q.defer();

    try {
        new ExifImage(
            {image: imageFile}, function (error, exifData) {
                if (error) {
                    dfd.reject(error);
                } else {
                    var matches   = dateRegex.exec(exifData.exif.CreateDate);
                    if (matches) {
                        var datestamp = Datestamp.fromYMD(matches[1], matches[2], matches[3]);
                        dfd.resolve(datestamp);
                    } else {
                        dfd.reject("Unknown CreateDate string format");
                    }

                }
            }
        );
    } catch (error) {
        dfd.reject(error);
    }

    return dfd.promise;
}


module.exports = {
    getCreateDate: getCreateDate
};
