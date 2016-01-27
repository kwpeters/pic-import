var path      = require("path"),
    Directory = require("./directory");

/**
 * Reduces an array of path segments into a path string.  If there are any Directory
 * objects in pathParts, all previous parts are discarded.
 * @param {Array.<string|Directory>} pathParts - The parts comprising the path
 * @returns {string} The resulting path
 */
function reducePathParts(pathParts) {
    "use strict";

    return pathParts.reduce(
        function (prev, curArg) {
            if (curArg instanceof Directory) {
                return curArg.toString();
            }
            return path.join(prev, curArg.toString());
        },
        "");
}


module.exports = {
    reducePathParts: reducePathParts
};