/* global describe */
/* global describe */
/* global it */
/* global expect */

var PhotoLibrary = require("./photoLibrary");

describe("PhotoLibrary", function () {
    "use strict";

    describe("instance", function () {

        it("can be created",
            function () {
                var pl = new PhotoLibrary(__dirname);
                expect(pl).toBeDefined();
            }
        );
    });

});