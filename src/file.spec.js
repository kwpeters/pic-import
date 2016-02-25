/* global describe */
/* global it */
/* global expect */
/* global beforeEach */

var path      = require("path"),
    File      = require("./file"),
    Directory = require("./directory");


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


            it("should convert Directory objects to strings when joining arguments",
                function () {
                    var file = new File(
                        new Directory("foo"),
                        "baz.txt");

                    expect(file.toString()).toEqual("foo/baz.txt");
                }
            );


            it("when a Directory is present everything that precedes it should be discarded",
                function () {
                    var file = new File(
                        new Directory("foo"),
                        new Directory("bar"),
                        "baz.txt");

                    expect(file.toString()).toEqual("bar/baz.txt");
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


        describe("copy()", function () {

            var destDir = new Directory("tmp");

            beforeEach(function () {
                destDir.emptySync();
            });


            it("should copy the file to the specified destination directory",
                function (done) {

                    var srcFile = new File("test/input/2015-03-11 09.05.32.jpg");

                    srcFile.copy(destDir)
                        .then(
                            function (destFile) {
                                expect(destFile.toString()).toEqual("tmp/2015-03-11 09.05.32.jpg");
                                expect(destFile.existsSync()).toBeTruthy();
                                done();
                            }
                        );
                }
            );


            it("should rename the file when a directory and filename is specified",
                function (done) {
                    var srcFile = new File("test/input/2015-03-11 09.05.32.jpg");

                    srcFile.copy(destDir, "foo.jpg")
                        .then(
                            function (destFile) {
                                expect(destFile.toString()).toEqual("tmp/foo.jpg");
                                expect(destFile.existsSync()).toBeTruthy();
                                done();
                            }
                        );
                }
            );


            it("should rename the file when a destination File is specified",
                function (done) {
                    var srcFile  = new File("test/input/2015-03-11 09.05.32.jpg"),
                        destFile = new File("tmp/foo2.jpg");

                    srcFile.copy(destFile)
                        .then(
                            function (destFile) {
                                expect(destFile.toString()).toEqual("tmp/foo2.jpg");
                                expect(destFile.existsSync()).toBeTruthy();
                                done();
                            }
                        );
                }
            );


            it("should reject if the source file does not exist",
                function (done) {
                    var srcFile = new File("test/input/does_not_exist.jpg");

                    srcFile.copy(destDir)
                        .catch(
                            function () {
                                var destFile = new File(destDir.toString(), "does_not_exist.jpg");
                                expect(destFile.existsSync()).toBeFalsy();
                                done();
                            }
                        );

                }
            );


            it("should overwrite the destination file if it already exists",
                function (done) {

                    var origFile,
                        origSize,
                        newFile,
                        newSize;

                    // Create a small text file and get its size.
                    origFile = new File(destDir, "test.txt");
                    origFile.writeSync("abc");
                    origSize = origFile.statsSync().size;


                    // Create another file and get its size.
                    newFile = new File(destDir, "source.txt");
                    newFile.writeSync("abcdefghijklmnopqrstuvwxyz");
                    newSize = newFile.statsSync().size;


                    // Copy newFile over origFile.  Get the size of the copied file.
                    // It should equal the size of newFile.
                    newFile.copy(origFile)
                        .then(
                            function (destFile) {
                                expect(destFile.statsSync().size).toEqual(newSize);
                                done();
                            }
                        );
                }
            );

        });


        describe("copySync()", function () {

            var destDir = new Directory("tmp");

            beforeEach(function () {
                destDir.emptySync();
            });


            it("should copy the file to the specified destination directory",
                function () {

                    var srcFile = new File("test/input/2015-03-11 09.05.32.jpg");
                    var destFile = srcFile.copySync(destDir);
                    expect(destFile.toString()).toEqual("tmp/2015-03-11 09.05.32.jpg");
                    expect(destFile.existsSync()).toBeTruthy();
                }
            );


            it("should rename the file when a directory and filename is specified",
                function () {
                    var srcFile = new File("test/input/2015-03-11 09.05.32.jpg"),
                        destFile = srcFile.copySync(destDir, "foo.jpg");
                    expect(destFile.toString()).toEqual("tmp/foo.jpg");
                    expect(destFile.existsSync()).toBeTruthy();
                }
            );


            it("should rename the file when a destination File is specified",
                function () {
                    var srcFile  = new File("test/input/2015-03-11 09.05.32.jpg"),
                        destFile = new File("tmp/foo2.jpg");

                    destFile = srcFile.copySync(destFile);
                    expect(destFile.toString()).toEqual("tmp/foo2.jpg");
                    expect(destFile.existsSync()).toBeTruthy();
                }
            );


            it("should reject if the source file does not exist",
                function () {
                    var srcFile = new File("test/input/does_not_exist.jpg");

                    expect(function () {srcFile.copySync(destDir);}).toThrow();
                    expect(new File(destDir.toString(), "does_not_exist.jpg").existsSync()).toBeFalsy();
                }
            );


            it("should overwrite the destination file if it already exists",
                function () {

                    var origFile,
                        origSize,
                        newFile,
                        newSize,
                        destFile;

                    // Create a small text file and get its size.
                    origFile = new File(destDir, "test.txt");
                    origFile.writeSync("abc");
                    origSize = origFile.statsSync().size;


                    // Create another file and get its size.
                    newFile = new File(destDir, "source.txt");
                    newFile.writeSync("abcdefghijklmnopqrstuvwxyz");
                    newSize = newFile.statsSync().size;


                    // Copy newFile over origFile.  Get the size of the copied file.
                    // It should equal the size of newFile.
                    destFile = newFile.copySync(origFile);
                    expect(destFile.statsSync().size).toEqual(newSize);
                }
            );


        });


        describe("move()", function () {

            var tmpDir  = new Directory("tmp"),
                destDir = new Directory(tmpDir, "dest"),
                srcDir  = new Directory(tmpDir, "src"),
                srcFile;

            beforeEach(function () {
                tmpDir.emptySync();
                srcFile = new File("test/input/2015-03-11 09.05.32.jpg").copySync(srcDir);
            });


            it("should move the file to the specified destination directory",
                function (done) {

                    srcFile.move(destDir)
                        .then(
                            function (destFile) {
                                expect(destFile.toString())
                                    .toEqual("tmp/dest/2015-03-11 09.05.32.jpg");
                                expect(destFile.existsSync()).toBeTruthy();
                                expect(srcFile.existsSync()).toBeFalsy();
                                done();
                            }
                        );
                }
            );


            it("should rename the file when a directory and filename is specified",
                function (done) {

                    srcFile.move(destDir, "foo.jpg")
                        .then(
                            function (destFile) {
                                expect(destFile.toString()).toEqual("tmp/dest/foo.jpg");
                                expect(destFile.existsSync()).toBeTruthy();
                                expect(srcFile.existsSync()).toBeFalsy();
                                done();
                            }
                        );
                }
            );


            it("should rename the file when a destination File is specified",
                function (done) {
                    var destFile = new File(destDir, "foo2.jpg");

                    srcFile.move(destFile)
                        .then(
                            function (destFile) {
                                expect(destFile.toString()).toEqual("tmp/dest/foo2.jpg");
                                expect(destFile.existsSync()).toBeTruthy();
                                expect(srcFile.existsSync()).toBeFalsy();
                                done();
                            }
                        );
                }
            );


            it("should reject if the source file does not exist",
                function (done) {
                    var srcFile = new File("test/input/does_not_exist.jpg");

                    srcFile.move(destDir)
                        .catch(
                            function () {
                                var destFile = new File(destDir, "does_not_exist.jpg");
                                expect(destFile.existsSync()).toBeFalsy();
                                done();
                            }
                        );

                }
            );


            it("should overwrite the destination file if it already exists",
                function (done) {

                    var origFile,
                        origSize,
                        newFile,
                        newSize;

                    // Create a small text file and get its size.
                    origFile = new File(destDir, "test.txt");
                    origFile.writeSync("abc");
                    origSize = origFile.statsSync().size;


                    // Create another file and get its size.
                    newFile = new File(destDir, "source.txt");
                    newFile.writeSync("abcdefghijklmnopqrstuvwxyz");
                    newSize = newFile.statsSync().size;


                    // Move newFile over origFile.  Get the size of the resulting file.
                    // It should equal the size of newFile.

                    newFile.move(origFile)
                        .then(
                            function (destFile) {
                                expect(destFile.statsSync().size).toEqual(newSize);
                                expect(newFile.existsSync()).toBeFalsy();
                                done();
                            }
                        );
                }
            );

        });


        describe("moveSync()", function () {

            var tmpDir  = new Directory("tmp"),
                destDir = new Directory(tmpDir, "dest"),
                srcDir  = new Directory(tmpDir, "src"),
                srcFile;

            beforeEach(function () {
                tmpDir.emptySync();
                srcFile = new File("test/input/2015-03-11 09.05.32.jpg").copySync(srcDir);
            });


            it("should copy the file to the specified destination directory",
                function () {

                    var destFile = srcFile.moveSync(destDir);
                    expect(destFile.toString()).toEqual("tmp/dest/2015-03-11 09.05.32.jpg");
                    expect(destFile.existsSync()).toBeTruthy();
                    expect(srcFile.existsSync()).toBeFalsy();
                }
            );


            it("should rename the file when a directory and filename is specified",
                function () {
                    var destFile = srcFile.moveSync(destDir, "foo.jpg");
                    expect(destFile.toString()).toEqual("tmp/dest/foo.jpg");
                    expect(destFile.existsSync()).toBeTruthy();
                    expect(srcFile.existsSync()).toBeFalsy();
                }
            );


            it("should rename the file when a destination File is specified",
                function () {
                    var destFile = new File(destDir, "foo2.jpg");

                    destFile = srcFile.moveSync(destFile);
                    expect(destFile.toString()).toEqual("tmp/dest/foo2.jpg");
                    expect(destFile.existsSync()).toBeTruthy();
                    expect(srcFile.existsSync()).toBeFalsy();
                }
            );


            it("should reject if the source file does not exist",
                function () {
                    var srcFile = new File("test/input/does_not_exist.jpg");

                    expect(function () {srcFile.moveSync(destDir);}).toThrow();
                    expect(new File(destDir.toString(), "does_not_exist.jpg").existsSync()).toBeFalsy();
                }
            );


            it("should overwrite the destination file if it already exists",
                function () {

                    var origFile,
                        origSize,
                        newFile,
                        newSize,
                        destFile;

                    // Create a small text file and get its size.
                    origFile = new File(destDir, "test.txt");
                    origFile.writeSync("abc");
                    origSize = origFile.statsSync().size;


                    // Create another file and get its size.
                    newFile = new File(destDir, "source.txt");
                    newFile.writeSync("abcdefghijklmnopqrstuvwxyz");
                    newSize = newFile.statsSync().size;


                    // Copy newFile over origFile.  Get the size of the copied file.
                    // It should equal the size of newFile.
                    destFile = newFile.moveSync(origFile);
                    expect(destFile.statsSync().size).toEqual(newSize);
                    expect(newFile.existsSync()).toBeFalsy();
                }
            );


        });


        describe("split()", function () {

            it("should return the three parts of the path",
                function () {
                    var f     = new File("../tmp/bar/baz.foo"),
                        parts = f.split();

                    expect(parts[0]).toEqual("../tmp/bar/");
                    expect(parts[1]).toEqual("baz");
                    expect(parts[2]).toEqual(".foo");
                }
            );

            it("concatenating the parts should completely reconstruct the original path",
                function () {
                    var filePath = "../tmp/bar/baz.foo",
                        f        = new File(filePath),
                        parts    = f.split();

                    expect(parts.join("")).toEqual(filePath);
                }
            );


            it("it should be able to handle a file path with no directory",
                function () {
                    var filePath = "baz.txt",
                        f        = new File(filePath),
                        parts    = f.split();

                    expect(parts[0]).toEqual("./");
                }
            );


            it("should be able to handle a file without an extension",
                function () {
                    var f     = new File("../tmp/bar/baz"),
                        parts = f.split();

                    expect(parts[0]).toEqual("../tmp/bar/");
                    expect(parts[1]).toEqual("baz");
                    expect(parts[2]).toEqual("");
                }
            );


            it("should return the name of a dotfile as the basename",
                function () {
                    var f     = new File("../tmp/bar/.baz"),
                        parts = f.split();

                    expect(parts[0]).toEqual("../tmp/bar/");
                    expect(parts[1]).toEqual(".baz");
                    expect(parts[2]).toEqual("");
                }
            );

        });
        
        
        describe("getFileName()", function () {

            it("should return just the filename",
                function () {
                    var f = new File("../tmp/bar.foo");

                    expect(f.getFileName()).toEqual("bar.foo");
                }
            );

            
            it("should return something appropriate for a dotfile",
                function () {
                    var f = new File("../tmp/.foo");
                    expect(f.getFileName()).toEqual(".foo");
                }
            );


            it("should return something appropriate for a file with no extension",
                function () {
                    var f = new File("../tmp/foo");
                    expect(f.getFileName()).toEqual("foo");
                }
            );
        });


        describe("directory()", function () {

            it("should return the directory of this file",
                function () {
                    var dir  = new Directory("../foo/bar"),
                        file = new File(dir.toString(), "baz.txt");

                    expect(file.directory().toString()).toEqual(dir.toString());
                }
            );

        });
        
        
        describe("write()", function () {


            it("creates any necessary directories",
                function (done) {
                    var dir = new Directory(path.join("tmp", "foo", "bar")),
                        outFile = new File(dir, 'test.txt');

                    outFile.write("hello world")
                        .then(function () {
                            expect(outFile.existsSync()).toBeTruthy();
                            done();
                        });

                }
            );


            it("writes the specified text to the file",
                function (done) {
                    var dir = new Directory("tmp"),
                        outFile = new File(dir, "test.txt");

                    outFile.write("12345")
                        .then(function () {
                            return outFile.read();
                        })
                        .then(function (text) {
                            expect(text).toEqual("12345");
                            done();
                        });
                }
            );

        });

        describe("writeSync()", function () {


            it("creates any necessary directories",
                function () {
                    var dir = new Directory(path.join("tmp", "foo", "bar")),
                        outFile = new File(dir, 'test.txt');

                    outFile.writeSync("hello world");
                    expect(outFile.existsSync()).toBeTruthy();
                }
            );


            it("writes the specified text to the file",
                function () {
                    var dir = new Directory("tmp"),
                        outFile = new File(dir, "test.txt");

                    outFile.writeSync("12345");
                    var actualText = outFile.readSync();
                    expect(actualText).toEqual("12345");
                }
            );
        });

    });


});
