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


            it("import() will copy files appropriately into the photo library directory structure",
                function () {
                    expect(false).toBeTruthy();
                }
            );


        });



    });

});