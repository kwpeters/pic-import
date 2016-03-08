var gulp  = require("gulp"),
    gutil = require("gulp-util"),
    q     = require("q");

(function () {
    "use strict";

    ////////////////////////////////////////////////////////////////////////////////
    gulp.task("test", function () {

        var gh  = require("gulp-helpers"),
            cmd = "node ./node_modules/jasmine-node/bin/jasmine-node --color ./src/";

        return gh.exec(cmd, {cwd: __dirname})
            .then(
                function (stdout) {
                    gutil.log("SUCCESS");
                    gutil.log(stdout);
                }
            )
            .catch(
                function (err) {
                    gutil.log("FAILED");
                    gutil.log(err.stdout);
                }
            );
    });


    gulp.task("build", function () {
    });


})();
