'use strict';
var _ = require('underscore');
var async = require('async');
var express = require('express');
var WeChat = require('gridvo-wechat');

var router = express.Router();
var corpAuthSuiteService = WeChat.createCorpAuthSuiteService();
var constant = WeChat.constant;

router.get('/smart-station-suite', function (req, res) {
    var smartStationSuite = "tj75d1122acf5ed4aa";
    async.waterfall([function (cb) {
        corpAuthSuiteService.getSuitePreAuthCode(constant[smartStationSuite].suiteID, cb);
    }, function (preAuthCode, cb) {
        if (!preAuthCode) {
            res.end();
            return;
        }
        var suiteID = constant[smartStationSuite].suiteID;
        var redirectURI = 'http://pascal.gridvo.com/wechat/smart-station-suite/corp-auth-complete';
        var state = "ok";
        corpAuthSuiteService.generateSuiteAuthURL(suiteID, preAuthCode, redirectURI, state, cb);
    }], function (err, suiteAuthURL) {
        if (err || !suiteAuthURL) {
            res.end();
            return;
        }
        res.redirect(suiteAuthURL);
    });
});

module.exports = router;