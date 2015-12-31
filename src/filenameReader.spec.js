var filenameReader = require("./filenameReader");


describe("filenameReader", function () {

    describe("getDate", function () {

        it("should extract the date when it is present at the beginning", function () {
            var date = filenameReader.getDate("./foo/2015-12-30blah.jpg");
            expect(date).toEqual(new Date(2015, 11, 30));
        });

        it("should extract the date when it is present in the middle", function () {
            var date = filenameReader.getDate("./foo/bar2015-12-30baz.jpg");
            expect(date).toEqual(new Date(2015, 11, 30));
        });

        it("should extract the date when it is present at the end", function () {
            var date = filenameReader.getDate("./foo/bar2015-12-30.jpg");
            expect(date).toEqual(new Date(2015, 11, 30));
        });

        it("should extract the date when it is delimited with '.'", function () {
            var date = filenameReader.getDate("./foo/bar2015.12.30.jpg");
            expect(date).toEqual(new Date(2015, 11, 30));
        });

        it("should extract the date when it is delimited with '_'", function () {
            var date = filenameReader.getDate("./foo/bar2015_12_30.jpg");
            expect(date).toEqual(new Date(2015, 11, 30));
        });

        it("should return undefined when the date is not present", function () {
            var date = filenameReader.getDate("./foo/bar-baz.jpg");
            expect(date).toBe(undefined);
        });

    });

});