var q         = require("q"),
    ExifImage = require("exif").ExifImage,
    dateRegex = /(\d{4}):(\d{2}):(\d{2})/;

function getCreateDate(imageFile) {
    var dfd = q.defer();

    try {
        new ExifImage(
            {image: imageFile}, function (error, exifData) {
                if (error) {
                    dfd.reject(error);
                } else {
                    var matches   = dateRegex.exec(exifData.exif.CreateDate);

                    if (matches) {
                        var year = matches[1];
                        var month = matches[2] - 1;  // zero-based
                        var day = matches[3];
                        var date = new Date(year, month, day);
                        dfd.resolve(date);
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

