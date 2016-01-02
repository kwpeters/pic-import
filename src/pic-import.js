var path         = require("path"),
    PhotoLibrary = require("./photoLibrary"),
    glob         = require("glob-all"),
    argv         = require("yargs")
        .usage("Usage: $0 -l library_dir -i import_dir")
        .demand(["l", "i"])
        .alias("l", "libraryDir")
        .alias("i", "importDir")
        .argv;


//function oldmain() {
//    var libraryRoot    = ".",
//        imageFiles     = [
//            "test/input/2015-03-11 09.05.32.jpg",
//            "test/input/IMG_8718-canon.JPG"
//        ];
//
//    imageFiles.map(function (imageFile) {
//        exifReader.getCreateDate(imageFile).then(function (creationDate) {
//            console.log("File:", imageFile, "Created:", creationDate);
//        });
//    });
//}


function main() {
    "use strict";

    var photoLibrary = new PhotoLibrary(argv.libraryDir),
        importGlobs  = [
            path.join(argv.importDir, "**", "*.jpg"),
            path.join(argv.importDir, "**", "*.JPG")
        ],
        importFiles  = glob.sync(importGlobs);
}


main();