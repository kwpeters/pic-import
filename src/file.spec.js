/* global describe */
/* global it */
/* global expect */
var File = require("./file");


describe("File", function () {
    "use strict";

    describe("static", function () {

        describe("exists()", function () {

            it("should resolve with the file's stats when the file exists",
                function (done) {
                    File.exists(__filename)
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
                    File.exists("./foo/bar.txt")
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

    describe("instance", function () {

        describe("toString", function () {

            it("shouldreturn a string representation",
                function () {
                    var file = new File("./foo/bar.txt");
                    expect(file.toString()).toEqual("./foo/bar.txt");
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