/* global describe */
/* global expect */
/* global it */

var DatestampDir = require("./datestampDir");


describe("DatestampDir", function () {
    "use strict";

    describe("static", function () {

        describe("test()", function () {

            it("should return null when given a path with no timestamp",
                function () {
                    var dateStr = DatestampDir.test("./foo/bar/baz");
                    expect(dateStr).toBeNull();
                }
            );


            it("should return the datestamp string when given a path that has one",
                function () {
                    var datestamp = DatestampDir.test("./foo/2016-01-01/");
                    expect(datestamp.toString()).toEqual("2016-01-01");
                }
            );


            it("should return the datestamp string when the path uses a different delimiter",
                function () {
                    var datestamp = DatestampDir.test("./foo/2016_01_01/");
                    expect(datestamp.toString()).toEqual("2016-01-01");
                }
            );
            

            it("should retur the datestamp string when there is additional text",
                function () {
                    var datestamp = DatestampDir.test("./foo/2016-01-01-some event/");
                    expect(datestamp.toString()).toEqual("2016-01-01");
                }
            );

        });

    });

    describe("instance", function () {

        it("should be creatable",
            function () {
                var dsDir = new DatestampDir();
                expect(dsDir).toBeDefined();
            }
        );

    });

});