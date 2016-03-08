/* global describe */
/* global describe */
/* global beforeEach */
/* global it */
/* global expect */



var q            = require("q"),
    PhotoLibrary = require("./photoLibrary"),
    Directory    = require("./directory"),
    File         = require("./file"),
    Datestamp    = require("./datestamp"),
    tmpDir       = new Directory("tmp");

describe("PhotoLibrary", function () {
    "use strict";


    beforeEach(function () {
        // Make sure the tmp directory is empty before starting each test.
        tmpDir.emptySync();
    });


    describe(
        "static",
        function () {

            describe(
                "createDateDirMap",
                function () {

                    var libDir = new Directory(tmpDir, "lib");

                    beforeEach(function () {
                        libDir.ensureExistsSync();
                    });

                    it("should recognize a folder named with a normal datestamp",
                        function (done) {
                            var dirA = new Directory(libDir, Datestamp.fromYMD(2016, 2, 20)),
                                dirB = new Directory(libDir, Datestamp.fromYMD(2016, 2, 21));

                            dirA.ensureExistsSync();
                            dirB.ensureExistsSync();

                            PhotoLibrary.createDateDirMap(libDir)
                                .then(
                                    function (dateDirMap) {
                                        expect(Object.keys(dateDirMap).length).toEqual(2);
                                        expect(dateDirMap["2016-02-20"].toString())
                                            .toEqual("tmp/lib/2016-02-20");
                                        expect(dateDirMap["2016-02-21"].toString())
                                            .toEqual("tmp/lib/2016-02-21");
                                        done();
                                    }
                                );
                        }
                    );

                    it("should recognize a foler with addition text appended",
                        function (done) {

                            var dirA = new Directory(libDir, Datestamp.fromYMD(2016, 2, 20) + " - event A"),
                                dirB = new Directory(libDir, Datestamp.fromYMD(2016, 2, 21) + "_event_B");

                            dirA.ensureExistsSync();
                            dirB.ensureExistsSync();

                            PhotoLibrary.createDateDirMap(libDir)
                                .then(
                                    function (dateDirMap) {
                                        expect(Object.keys(dateDirMap).length).toEqual(2);
                                        expect(dateDirMap["2016-02-20"].toString())
                                            .toEqual("tmp/lib/2016-02-20 - event A");
                                        expect(dateDirMap["2016-02-21"].toString())
                                            .toEqual("tmp/lib/2016-02-21_event_B");
                                        done();
                                    }
                                );

                        }
                    );
                }
            );

        }
    );

    describe(
        "instance",
        function () {


        it("can be created",
            function () {
                var rootDirectory = new Directory(__dirname);
                var pl = new PhotoLibrary(rootDirectory);
                expect(pl).toBeDefined();
            }
        );

        describe("import()", function () {

            var libDir = new Directory(tmpDir, "photo-library"),
                srcDir = new Directory(tmpDir, "source-photos"),
                fileA,
                fileB,
                fileC;


            beforeEach(function () {
                // Make sure the tmp folder is setup so we have one directory to
                // import from and another directory to serve as the PhotoLibrary root
                // directory to import into.

                tmpDir.emptySync();
                libDir.ensureExistsSync();
                fileA = new File("./test/input/2015-03-11 09.05.32.jpg").copySync(srcDir);
                fileB = new File("./test/input/IMG_8718-canon.JPG").copySync(srcDir);
                fileC = new File("./test/input/P1040165-panasonic.JPG").copySync(srcDir);
            });


            it("will move a picture into the library when the library already has a folder for the date",
                function (done) {

                    // Create the directory where the imported pictures will go.
                    new Directory(libDir, "2015-03-11").ensureExistsSync();
                    new Directory(libDir, "2015-12-30").ensureExistsSync();

                    var lib = new PhotoLibrary(libDir);

                    q.all([lib.import(fileA), lib.import(fileB), lib.import(fileC)])
                        .then(
                            function (importedFiles) {

                                // The file should be moved into the photo library.
                                expect(importedFiles[0].toString())
                                    .toEqual("tmp/photo-library/2015-03-11/2015-03-11 09.05.32.jpg");
                                expect(importedFiles[1].toString())
                                    .toEqual("tmp/photo-library/2015-12-30/IMG_8718-canon.JPG");
                                expect(importedFiles[2].toString())
                                    .toEqual("tmp/photo-library/2015-12-30/P1040165-panasonic.JPG");

                                // The original file should no longer exist.
                                expect(fileA.existsSync()).toBeFalsy();
                                expect(fileB.existsSync()).toBeFalsy();
                                expect(fileC.existsSync()).toBeFalsy();

                                done();
                            }
                        );
                }
            );


            it("will move a picture into the library when the library does not have a folder for the date",
                function (done) {

                    var lib = new PhotoLibrary(libDir);

                    q.all([lib.import(fileA), lib.import(fileB), lib.import(fileC)])
                        .then(
                            function (importedFiles) {

                                // The file should be moved into the photo library.
                                expect(importedFiles[0].toString())
                                    .toEqual("tmp/photo-library/2015-03-11/2015-03-11 09.05.32.jpg");
                                expect(importedFiles[1].toString())
                                    .toEqual("tmp/photo-library/2015-12-30/IMG_8718-canon.JPG");
                                expect(importedFiles[2].toString())
                                    .toEqual("tmp/photo-library/2015-12-30/P1040165-panasonic.JPG");

                                // The original file should no longer exist.
                                expect(fileA.existsSync()).toBeFalsy();
                                expect(fileB.existsSync()).toBeFalsy();
                                expect(fileC.existsSync()).toBeFalsy();

                                done();
                            }
                        );
                }
            );


            it("will move a picture into a directory that already exists and has additional text",
                function (done) {
                    // Create the directory where the imported pictures will go.
                    new Directory(libDir, "2015-03-11 - eventA").ensureExistsSync();
                    new Directory(libDir, "2015-12-30 - eventB").ensureExistsSync();

                    var lib = new PhotoLibrary(libDir);

                    q.all([lib.import(fileA), lib.import(fileB), lib.import(fileC)])
                        .then(
                            function (importedFiles) {

                                // The file should be moved into the photo library.
                                expect(importedFiles[0].toString())
                                    .toEqual("tmp/photo-library/2015-03-11 - eventA/2015-03-11 09.05.32.jpg");
                                expect(importedFiles[1].toString())
                                    .toEqual("tmp/photo-library/2015-12-30 - eventB/IMG_8718-canon.JPG");
                                expect(importedFiles[2].toString())
                                    .toEqual("tmp/photo-library/2015-12-30 - eventB/P1040165-panasonic.JPG");

                                // The original file should no longer exist.
                                expect(fileA.existsSync()).toBeFalsy();
                                expect(fileB.existsSync()).toBeFalsy();
                                expect(fileC.existsSync()).toBeFalsy();

                                done();
                            }
                        );
                }
            );


            it("will not move a file into the library when it already exists",
                function () {
                    expect(false).toBeTruthy();
                }
            );


        });


    });

});
