/* global describe  */
/* global it */
var exifReader = require("./exifReader");


describe('exifReader', function () {
    "use strict";

    describe("getCreateDate", function () {
        it("should be able to read creation date from an iPhone image", function () {
            var value;

            runs(function() {
                exifReader.getCreateDate("test/input/2015-03-11 09.05.32.jpg").then(
                    function (creationDate) {
                        value = creationDate;
                    }
                );
            });

            waitsFor(function() {
                return value !== undefined;
            }, "The creation date should be read", 750);

            runs(function() {
                expect(value).toEqual(new Date(2015, 2, 11));
            });

        });

        it("should be able to read creation date from a Canon image", function () {
            var value;

            runs(function() {
                exifReader.getCreateDate("test/input/IMG_8718-canon.JPG").then(
                    function (creationDate) {
                        value = creationDate;
                    }
                );
            });

            waitsFor(function() {
                return value !== undefined;
            }, "The creation date should be read", 750);

            runs(function() {
                expect(value).toEqual(new Date(2015, 11, 30));
            });

        });

        it("should be able to read creation date from a Panasonic image", function () {
            var value;

            runs(function() {
                exifReader.getCreateDate("test/input/P1040165-panasonic.JPG").then(
                    function (creationDate) {
                        value = creationDate;
                    }
                );
            });

            waitsFor(function() {
                return value !== undefined;
            }, "The creation date should be read", 750);

            runs(function() {
                expect(value).toEqual(new Date(2015, 11, 30));
            });

        });



    });

});