/* global describe */
/* global it */
/* global expect */

var arrayHelpers = require("./arrayHelpers");

describe("arrayHelpers", function () {

    describe("anyMatchRegex()", function () {

        it("should return the matches when there is a match", function () {
            var match = arrayHelpers.anyMatchRegex(["", "abc", "a-b-c"], /.-.-./);
            expect(match).toBeDefined();
            expect(match[0]).toEqual("a-b-c");
        });

        it("should return null when there are no matches", function () {
            var match = arrayHelpers.anyMatchRegex(["", "abc", "a-b-c"], /._._./);
            expect(match).toBeNull();
        });
    });


});