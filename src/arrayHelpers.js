
// Tests the strings in arr and returns the first non-null match.
function anyMatchRegex(arr, regex) {

    var itemIndex,
        curMatch;

    for (itemIndex = 0; itemIndex < arr.length; ++itemIndex) {
        curMatch = regex.exec(arr[itemIndex]);
        if (curMatch) {
            return curMatch;
        }
    }

    return null;
}



module.exports = {
    anyMatchRegex: anyMatchRegex
};