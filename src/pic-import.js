var exifReader = require("./exifReader");


function main() {
    var imageFiles = [
        "test/input/2015-03-11 09.05.32.jpg",
        "test/input/IMG_8718-canon.JPG"
    ];

    imageFiles.map(function (imageFile) {
        exifReader.getCreateDate(imageFile).then(function (creationDate) {
            console.log("File:", imageFile, "Created:", creationDate);
        });
    });
}

main();