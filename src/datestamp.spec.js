/* global describe */
/* global it */
/* global expect */

var Datestamp = require("./datestamp");


describe("Datestamp", function () {
    "use strict";

    describe("static", function () {

        describe("fromYMD()", function () {

            it("should convert from a year, month and day to a Datestamp",
                function () {
                    var datestamp = Datestamp.fromYMD(2016, 1, 22);
                    expect(datestamp.toString()).toEqual("2016-01-22");
                }
            );

        });

    });


    describe("instance", function () {

        it("should be creatable",
            function () {
                var datestamp = new Datestamp(2016, 1, 1);
                expect(datestamp).toBeDefined();
            }
        );


        it("toString() will return the appropriate string",
            function () {
                var datestamp = new Datestamp(new Date(2016, 0, 1));
                expect(datestamp.toString()).toEqual("2016-01-01");
            }
        );

    });

});