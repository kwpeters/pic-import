/* global describe */
/* global it */
/* global expect */
/* global beforeEach */

var path      = require("path"),
    Directory = require("./directory");

describe(
    "Directory",
    function () {
        "use strict";


        //describe(
        //    "static method",
        //    function () {
        //
        //        describe(
        //            "exists()",
        //            function () {
        //                it(
        //                    "should fulfill with a truthy stats object when given a directory",
        //                    function (done) {
        //                        Directory.exists(__dirname)
        //                            .then(
        //                                function (stats) {
        //                                    expect(stats).toBeTruthy();
        //                                    done();
        //                                }
        //                            );
        //                    }
        //                );
        //
        //                it(
        //                    "should fulfill with false when given a file",
        //                    function (done) {
        //                        Directory.exists(__filename)
        //                            .then(
        //                                function (stats) {
        //                                    expect(stats).toBe(false);
        //                                    done();
        //                                }
        //                            );
        //                    });
        //            }
        //        );
        //    }
        //);


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


                describe("toString()", function () {

                    it("should return the original path",
                        function () {
                            var dir = new Directory("foo/bar/baz");
                            expect(dir.toString()).toEqual("foo/bar/baz");
                        }
                    );

                });


                describe("split()", function () {

                    it("can split the path into parts",
                        function () {
                            var dir   = new Directory("foo/bar/baz");
                            var parts = dir.split();
                            expect(parts.length).toBe(3);
                            expect(parts[0]).toEqual("foo");
                            expect(parts[1]).toEqual("bar");
                            expect(parts[2]).toEqual("baz");
                        }
                    );

                });


                describe("getSubdirectories()", function () {

                    it("can return subdirectories",
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

                });


                describe("getSubdirectoriesSync()", function () {

                    it("can return subdirectories",
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


                describe("exists()", function () {

                    it("should be fulfilled with a truthy stats object when given an existing directory",
                        function (done) {
                            var dir = new Directory(__dirname);

                            dir.exists()
                                .then(
                                    function (stats) {
                                        expect(stats).toBeTruthy();
                                        expect(stats.isDirectory).toBeDefined();
                                        done();
                                    }
                                );
                        }
                    );

                    it("should be fulfilled with false when given a directory that does not exist",
                        function (done) {

                            var dir = new Directory("foo/bar");

                            dir.exists()
                                .then(
                                    function (stats) {
                                        expect(stats).toBe(false);
                                        done();
                                    }
                                );
                        }
                    );

                });


                describe("existsSync()", function () {

                    it("should return a truthy stats object when given an existing directory",
                        function () {
                            var dir = new Directory(__dirname),
                                stats = dir.existsSync();

                            expect(stats).toBeTruthy();
                            expect(stats.isDirectory()).toBeTruthy();
                        }
                    );

                    
                    it("should return false when given a directory that does not exist",
                        function () {
                            var dir = new Directory("foo/bar"),
                                stats = dir.existsSync();

                            expect(stats).toBe(false);
                        }
                    );

                });


                describe("ensureExists()", function () {

                    beforeEach(function () {
                        var tmpDir = new Directory("tmp");
                        tmpDir.emptySync();
                    });

                    it("should be able to create a single directory that does not exist",
                        function (done) {
                            
                            var dir = new Directory("tmp/sample");
                            expect(dir.existsSync()).toBeFalsy();
                            
                            dir.ensureExists().then(
                                function () {
                                    expect(dir.existsSync()).toBeTruthy();
                                    done();
                                }
                            );
                        }
                    );


                    it("should be able to create multiple directory levels that do not exist",
                        function (done) {
                            var dir = new Directory("tmp/dirA/dirB/dirC");
                            expect(dir.existsSync()).toBeFalsy();

                            dir.ensureExists().then(
                                function () {
                                    expect(dir.existsSync()).toBeTruthy();
                                    done();
                                }
                            );
                        }
                    );

                });


                describe("ensureExistsSync()", function () {

                    beforeEach(function () {
                        var tmpDir = new Directory("tmp");
                        tmpDir.emptySync();
                    });


                    it("should be able to create a single directory that does not exist",
                        function () {
                            var dir = new Directory("tmp/sample");
                            expect(dir.existsSync()).toBeFalsy();

                            dir.ensureExistsSync();
                            expect(dir.existsSync()).toBeTruthy();
                        }
                    );


                    it("should be able to create multiple direcory levels that do not exist",
                        function () {
                            var dir = new Directory("tmp/dirA/dirB/dirC");
                            expect(dir.existsSync()).toBeFalsy();

                            dir.ensureExistsSync();
                            expect(dir.existsSync()).toBeTruthy();
                        }
                    );

                });


                describe("empty()", function () {

                    it("",
                        function () {
                            expect(false).toBeTruthy();
                        }
                    );

                });


                describe("emptySync()", function () {

                    it("",
                        function () {
                            expect(false).toBeTruthy();
                        }
                    );

                });

            });

    }
);

