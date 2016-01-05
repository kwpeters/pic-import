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
            }
        );


        describe(
            "instance",
            function () {

                describe("constructor", function () {

                    it("can create instances",
                        function () {
                            var dir = new Directory("/");
                            expect(dir).toBeDefined();
                        }
                    );


                    it("will remove trailing directory seperator characters if present",
                        function () {
                            var dir = new Directory("foo/bar/");
                            expect(dir.toString()).toEqual("foo/bar");
                        }
                    );


                    it("will join all arguments to form the directory path",
                        function () {
                            var dir = new Directory("foo", "bar", "baz", "quux");
                            expect(dir.toString()).toEqual("foo/bar/baz/quux");
                        }
                    );

                });


                it("split() can split the path into parts",
                    function () {
                        var dir   = new Directory("foo/bar/baz");
                        var parts = dir.split();
                        expect(parts.length).toBe(3);
                        expect(parts[0]).toEqual("foo");
                        expect(parts[1]).toEqual("bar");
                        expect(parts[2]).toEqual("baz");
                    }
                );


                it("toString() should return the original path",
                    function () {
                        var dir = new Directory("foo/bar/baz");
                        expect(dir.toString()).toEqual("foo/bar/baz");
                    }
                );


                it("getSubdirectories() can return subdirectories",
                    function (done) {
                        var dir = new Directory(path.join(__dirname, ".."));
                        dir.getSubdirectories()
                            .then(
                                function (subdirs) {
                                    expect(subdirs.length).toBe(6);
                                    expect(subdirs[0].toString().slice(-4)).toEqual(".git");
                                    expect(subdirs[1].toString().slice(-5)).toEqual(".idea");
                                    expect(subdirs[2].toString().slice(-12)).toEqual("node_modules");
                                    expect(subdirs[3].toString().slice(-3)).toEqual("src");
                                    expect(subdirs[4].toString().slice(-4)).toEqual("test");
                                    expect(subdirs[5].toString().slice(-3)).toEqual("tmp");
                                    done();
                                }
                            );
                    }
                );

                it("getSubdirectoriesSync() can return subdirectories",
                    function () {
                        var dir = new Directory(path.join(__dirname, ".."));
                        var subdirs = dir.getSubdirectoriesSync();
                        expect(subdirs.length).toBe(6);
                        expect(subdirs[0].toString().slice(-4)).toEqual(".git");
                        expect(subdirs[1].toString().slice(-5)).toEqual(".idea");
                        expect(subdirs[2].toString().slice(-12)).toEqual("node_modules");
                        expect(subdirs[3].toString().slice(-3)).toEqual("src");
                        expect(subdirs[4].toString().slice(-4)).toEqual("test");
                        expect(subdirs[5].toString().slice(-3)).toEqual("tmp");
                    }
                );

            });


    }
);

