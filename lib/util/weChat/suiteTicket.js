'use strict';
var fs = require('fs');

var SuiteTicket = {};

SuiteTicket.save = function (suiteTicket, callback) {
    fs.writeFile('suiteTicket.txt', suiteTicket, {encoding: "utf8"}, (err) => {
        if (err) {
            callback(err);
            return;
        }
        let result = {};
        result.isSuccess = true;
        callback(null, result);
    });
};

SuiteTicket.obtain = function (callback) {
    fs.readFile('suiteTicket.txt', {encoding: "utf8"}, (err, suiteTicket) => {
        callback(err, suiteTicket);
    });
};

module.exports = SuiteTicket;