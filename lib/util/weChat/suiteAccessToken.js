'use strict';
var fs = require('fs');

var SuiteAccessToken = {};

SuiteAccessToken.save = function (jsonStr, callback) {
    fs.writeFile('suiteAccessToken.txt', jsonStr, {encoding: "utf8"}, (err) => {
        if (err) {
            callback(err);
            return;
        }
        let result = {};
        result.isSuccess = true;
        callback(null, result);
    });
};

SuiteAccessToken.obtain = function (callback) {
    fs.readFile('suiteAccessToken.txt', {encoding: "utf8"}, (err, jsonStr) => {
        callback(err, jsonStr);
    });
};

SuiteAccessToken.getToken = function (callback) {
    var self = this;
    SuiteAccessToken.obtain((err, jsonStr)=> {
        if (err || !jsonStr) {
            callback(null, null);
            return;
        }
        let result = JSON.parse(jsonStr)[self.suiteId];
        if (result && (new Date().getTime()) < (new Date(result.suite_access_token_expire)).getTime()) {
            callback(null, {
                suite_access_token: result.suite_access_token,
                expires_in: result.suite_access_token_expire
            });
        } else {
            callback(null, null);
        }
    });
};

SuiteAccessToken.saveToken = function (suiteAccessToken, callback) {
    var self = this;
    SuiteAccessToken.obtain((err, jsonStr)=> {
        if (err) {
            callback(err);
            return;
        }
        var tokens = {};
        var token = {};
        var result = JSON.parse(jsonStr);
        if (result) {
            tokens = result;
        }
        if (tokens[self.suiteId]) {
            token = tokens[self.suiteId];
        }
        token.suite_access_token = suiteAccessToken.suite_access_token;
        token.suite_access_token_expire = new Date((new Date()).getTime() + 7190000);
        tokens[self.suiteId] = token;
        var jsonStr = JSON.stringify(tokens);
        SuiteAccessToken.save(jsonStr, (err, result)=> {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        })
    });
};

module.exports = SuiteAccessToken;