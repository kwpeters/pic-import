/* global describe */
/* global it */
/* global expect */

var path      = require("path"),
    Directory = require("./directory");

describe(
    "Directory",
    function () {
        "use strict";

        describe(
            "static method",
            function () {

                describe(
                    "isDirectory()",
                    function () {
                        it(
                            "should fulfill with true when given a directory",
                            function (done) {
                                Directory.exists(__dirname)
                                    .then(
                                        function (stats) {
                                            expect(stats).toBeTruthy();
                                            done();
                                        }
                                    );
                            }
                        );

                        it(
                            "should fulfill with false when given a file",
                            function (done) {
                                Directory.exists(__filename)
                                    .then(
                                        function (stats) {
                                            expect(stats).toBe(false);
                                            done();
                                        }
                                    );
                            });
                    }
                );
            });

        describe(
            "instance",
            function () {
                it("can be created",
                    function () {
                        var dir = new Directory("/");
                        expect(dir).toBeDefined();
                    }
                );

                it("split() can split the path into parts",
                    function () {
                        var dir   = new Directory("./foo/bar/baz");
                        var parts = dir.split();
                        expect(parts.length).toBe(4);
                        expect(parts[0]).toEqual(".");
                        expect(parts[1]).toEqual("foo");
                        expect(parts[2]).toEqual("bar");
                        expect(parts[3]).toEqual("baz");
                    }
                );

                it("toString() should return the original path",
                    function () {
                        var dir = new Directory("./foo/bar/baz/");
                        expect(dir.toString()).toEqual("./foo/bar/baz/");
                    }
                );

                it(
                    "getSubdirectories() can return subdirectories",
                    function (done) {
                        var dir = new Directory(path.join(__dirname, ".."));
                        dir.getSubdirectories()
                            .then(
                                function (subdirs) {
                                    expect(subdirs.length).toBe(6);
                                    expect(subdirs[0].slice(-4)).toEqual(".git");
                                    expect(subdirs[1].slice(-5)).toEqual(".idea");
                                    expect(subdirs[2].slice(-12)).toEqual("node_modules");
                                    expect(subdirs[3].slice(-3)).toEqual("src");
                                    expect(subdirs[4].slice(-4)).toEqual("test");
                                    expect(subdirs[5].slice(-3)).toEqual("tmp");
                                    done();
                                }
                            );
                    }
                );

            });


    }
);

