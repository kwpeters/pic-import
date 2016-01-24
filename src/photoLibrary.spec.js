/* global describe */
/* global describe */
/* global beforeEach */
/* global it */
/* global expect */



var PhotoLibrary = require("./photoLibrary"),
    Directory = require("./directory");

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


            beforeEach(function () {
                // Make sure the tmp folder is setup so we have one directory to
                // import from and another directory to serve as the PhotoLibrary root
                // directory.
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