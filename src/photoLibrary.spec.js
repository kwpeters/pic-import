/* global describe */
/* global describe */
/* global beforeEach */
/* global it */
/* global expect */



var PhotoLibrary = require("./photoLibrary"),
    Directory    = require("./directory"),
    File         = require("./file");

describe("PhotoLibrary", function () {
    "use strict";

    describe("instance", function () {


        it("can be created",
            function () {
                var rootDirectory = new Directory(__dirname);
                var pl = new PhotoLibrary(rootDirectory);
                expect(pl).toBeDefined();
            }
        );

        describe("import()", function () {

            var tmpDir = new Directory("tmp"),
                libDir = new Directory(tmpDir, "photo-library"),
                srcDir = new Directory(tmpDir, "source-photos");

            tmpDir.emptySync();
            libDir.ensureExistsSync();

            new File("./test/input/2015-03-11 09.05.32.jpg").copySync(srcDir);
            new File("./test/input/IMG_8718-canon.JPG").copySync(srcDir);
            new File("./test/input/P1040165-panasonic.JPG").copySync(srcDir);

            process.exit(-1);


            beforeEach(function () {
                // Make sure the tmp folder is setup so we have one directory to
                // import from and another directory to serve as the PhotoLibrary root
                // directory.

                destDir.emptySync();
            });


            it("will *move* a picture into the photo library",
                function () {
                    expect(false).toBeTruthy();
                }
            );


            it("will create a new directory and move a picture into it",
                function () {
                    expect(false).toBeTruthy();
                }
            );


            it("will move a picture into a directory that already exists",
                function () {
                    expect(false).toBeTruthy();
                }
            );


            it("will move a picture into a directory that already exists and has additional text",
                function () {
                    expect(false).toBeTruthy();
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
