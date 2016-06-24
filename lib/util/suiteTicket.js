'use strict';
var fs = require('fs');

var SuiteTicket = {};

SuiteTicket.save = function (suiteTicket, callback) {
    fs.open("suiteTicket.txt", "w", function (err, fd) {
        if (err) {
            callback(err);
            return;
        }
        fs.write(fd, suiteTicket, function (err) {
            if (err) {
                callback(err);
                return;
            }
            let result = {};
            result.isSuccess = true;
            callback(null, result);
        });
    });
};

module.exports = SuiteTicket;