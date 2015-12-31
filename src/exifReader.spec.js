/* global describe */
/* global expect */
/* global it */

var exifReader = require("./exifReader");


describe('exifReader', function () {
    "use strict";

    describe("getCreateDate", function () {
        it("should be able to read creation date from an iPhone image", function (done) {

            exifReader.getCreateDate("test/input/2015-03-11 09.05.32.jpg")
                .then(
                    function (creationDate) {
                        expect(creationDate).toEqual(new Date(2015, 2, 11));
                        done();
                    }
                );
        });

        it("should be able to read creation date from a Canon image", function () {
            exifReader.getCreateDate("test/input/IMG_8718-canon.JPG")
                .then(
                    function (creationDate) {
                        expect(creationDate).toEqual(new Date(2015, 11, 30));
                        done();
                    }
                );
        });

        it("should be able to read creation date from a Panasonic image", function (done) {
            exifReader.getCreateDate("test/input/P1040165-panasonic.JPG")
                .then(
                    function (creationDate) {
                        expect(creationDate).toEqual(new Date(2015, 11, 30));
                        done();
                    }
                );
        });

    });

});