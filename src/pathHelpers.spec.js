/* global describe */
/* global it */
/* global expect */

var pathHelpers = require("./pathHelpers"),
    Directory = require("./directory");

describe('reducePathParts()', function () {
    "use strict";


    it("should join the path parts",
        function () {
            var resultPath = pathHelpers.reducePathParts(["foo", "bar", "baz.txt"]);
            expect(resultPath).toEqual("foo/bar/baz.txt");
        }
    );


    it("should discard items preceding any Directory object",
        function () {
            var resultPath = pathHelpers.reducePathParts([
                "foo",
                new Directory("bar"),
                "baz.txt"]);

            expect(resultPath).toEqual("bar/baz.txt");
        }
    );


});