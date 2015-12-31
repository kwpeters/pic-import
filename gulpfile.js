var gulp = require("gulp"),
    gutil = require("gulp-util"),
    q = require("q");


(function () {
    "use strict";

    gulp.task("test", function () {
        var exec = require('child_process').exec,
            dfd      = q.defer(),
            cmd;

        cmd = 'node ./node_modules/jasmine-node/bin/jasmine-node --color ./src/';

        exec(cmd, {cwd: __dirname}, function (err, stdout/*, stderr*/) {
            if (err) {
                gutil.log('FAILED');
                gutil.log(stdout);
                dfd.reject();
            } else {
                gutil.log('SUCCESS');
                gutil.log(stdout);
                dfd.resolve();
            }
        });

        return dfd.promise;
    });


})();