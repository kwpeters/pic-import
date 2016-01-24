/* global describe */
/* global it */
/* global expect */
var File = require("./file");


describe("File", function () {
    "use strict";


    describe("instance", function () {

        describe("constructor", function () {

            it("should join all constructor arguments to form the file's path",
                function () {
                    var file = new File("foo", "bar", "baz.txt");
                    expect(file.toString()).toEqual("foo/bar/baz.txt");
                }
            );

        });


        describe("toString", function () {

            it("shouldreturn a string representation",
                function () {
                    var file = new File("foo/bar.txt");
                    expect(file.toString()).toEqual("foo/bar.txt");
                }
            );

        });


        describe("exists()", function () {

            it("should resolve with the file's stats when the file exists",
                function (done) {

                    var file = new File(__filename);
                    file.exists()
                        .done(
                            function (stats) {
                                expect(stats).toBeDefined();
                                done();
                            }
                        );
                }
            );


            it("should resolve with false when the file does not exist.",
                function (done) {
                    var file = new File("./foo/bar.txt");
                    file.exists()
                        .done(
                            function (stats) {
                                expect(stats).toBe(false);
                                done();
                            }
                        );
                }
            );

        });
    });


});