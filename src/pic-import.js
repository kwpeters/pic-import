var exifReader = require("./exifReader"),
    Directory  = require("./directory"),
    datestampRegex = /(\d{4})-(\d{2})-(\d{2})/,
    argv       = require("yargs")
        .usage("Usage: $0 -l library_dir -i import_dir")
        .demand(["l", "i"])
        .alias("l", "libraryDir")
        .alias("i", "importDir")
        .argv;


function main() {
    var libraryRoot    = ".",
        imageFiles     = [
            "test/input/2015-03-11 09.05.32.jpg",
            "test/input/IMG_8718-canon.JPG"
        ];

    imageFiles.map(function (imageFile) {
        exifReader.getCreateDate(imageFile).then(function (creationDate) {
            console.log("File:", imageFile, "Created:", creationDate);
        });
    });
}

//main();

function createDateDirMap(libraryDir) {
    var libDir = new Directory(libraryDir),
        subdirs;

    subdirs = libDir
        .getSubdirectories()
        .then(
            function (subdirs) {

                // We are only concerned with the subdirectories that have a date in
                // them.
                subdirs = subdirs.map(
                    function (curSubdir) {
                        var match = datestampRegex.exec(curSubdir);
                        return match ? {match: match, dir: curSubdir} : null;
                    }
                );

                subdirs = subdirs.filter(
                    function (curSubdirInfo) {
                        // Remove all the ones that did not match.
                        return curSubdirInfo;
                    });
                return subdirs;
            }
        )
        .done(function (subdirInfos) {
            console.log(subdirInfos);
        });
}


createDateDirMap(argv.libraryDir);