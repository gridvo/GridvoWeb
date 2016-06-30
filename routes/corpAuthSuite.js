'use strict';
var _ = require('underscore');
var async = require('async');
var express = require('express');
var weChatCorpServiceAPI = require('wechat-corp-service');
var constant = require('../lib/util/weChat/constant');
var SuiteAccessToken = require('../lib/util/weChat/suiteAccessToken');
var SuiteTicket = require('../lib/util/weChat/suiteTicket');

var router = express.Router();
var api = null;
var redirect_uri = 'http://pascal.gridvo.com/wechat/smart-station-suite/corp-auth-complete';
var auth_url = '';
router.get('/smart-station-suite', function (req, res) {
    async.waterfall([function (cb) {
        SuiteTicket.obtain(cb);
    }, function (suiteTicket, cb) {
        if (!suiteTicket) {
            res.end();
        }
        api = new weChatCorpServiceAPI(constant.smartStationSuite.suiteID,
            constant.smartStationSuite.suiteSecret,
            suiteTicket,
            SuiteAccessToken.getToken,
            SuiteAccessToken.saveToken);
        api.getPreAuthCode(cb);
    }], function (err, preAuthCode) {
        if (err) {
            res.end();
        }
        auth_url = api.generateAuthUrl(preAuthCode.pre_auth_code, encodeURIComponent(redirect_uri), 'OK');
        res.redirect(auth_url);
    });
});

module.exports = router;