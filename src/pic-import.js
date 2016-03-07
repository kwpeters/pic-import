var path         = require("path"),
    _            = require("lodash"),
    q            = require("q"), // todo: Replace q with es6-promise polyfill
    Directory    = require("./directory"),
    File         = require("./file"),
    PhotoLibrary = require("./photoLibrary"),
    glob         = require("glob-all"),
    argv         = require("yargs")
        .usage("Usage: $0 -l library_dir -i import_dir")
        .demand(["l", "i"])
        .alias("l", "libraryDir")
        .alias("i", "importDir")
        .argv;


function main() {
    "use strict";

    var photoLibraryDir = new Directory(argv.libraryDir),
        photoLibrary    = new PhotoLibrary(photoLibraryDir),
        importGlobs     = [
            path.join(argv.importDir, "**", "*.*")
        ],
        importFiles     = glob.sync(importGlobs),
        promises;


    console.log("Found " + importFiles.length + " files to import.");
    promises = importFiles.map(function (importFile) {
        photoLibrary.import(new File(importFile));
    });

    q.all(promises)
        .then(
            function (importedFiles) {
                console.log("Successfully imported " + importedFiles.length + " files.");
            }
        )
        .done();

}


main();
