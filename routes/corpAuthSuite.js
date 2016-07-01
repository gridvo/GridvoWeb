'use strict';
var _ = require('underscore');
var express = require('express');
var WeChat = require('gridvo-wechat');
var weChatCorpServiceAPI = require('wechat-corp-service');

var router = express.Router();
var api = null;
var redirect_uri = 'http://pascal.gridvo.com/wechat/smart-station-suite/corp-auth-complete';
var auth_url = '';
var constant = WeChat.constant;
var suiteAccessTokenManageService = WeChat.createSuiteAccessTokenManageService();
var getToken = function (callback) {
    var self = this;
    suiteAccessTokenManageService.getSuiteAccessToken(self.suiteId, (err, suiteAccessToken)=> {
        if (err || !suiteAccessToken) {
            callback(null, null);
            return;
        }
        if (suiteAccessToken && (new Date().getTime()) < (new Date(suiteAccessToken.expire)).getTime()) {
            callback(null, {
                suite_access_token: suiteAccessToken.accessToken,
                expires_in: suiteAccessToken.expire
            });
        } else {
            callback(null, null);
        }
    });
};
var saveToken = function (suiteAccessToken, callback) {
    var self = this;
    var suiteAccessTokenData = {};
    suiteAccessTokenData.suiteID = self.suiteId;
    suiteAccessTokenData.accessToken = suiteAccessToken.suite_access_token;
    suiteAccessTokenData.expire = new Date((new Date()).getTime() + 7190000);
    suiteAccessTokenManageService.saveSuiteAccessToken(suiteAccessTokenData, (err, isSuccess)=> {
        if (err) {
            callback(err);
            return;
        }
        if (!isSuccess) {
            callback(null);
            return;
        }
        callback(null);
    })
};
router.get('/smart-station-suite', function (req, res) {
    async.waterfall([function (cb) {
        let suiteTicketManageService = WeChat.createSuiteTicketManageService();
        suiteTicketManageService.getSuiteTicket(constant.smartStationSuite.suiteID, cb);
    }, function (suiteTicket, cb) {
        if (!suiteTicket) {
            res.end();
        }
        api = new weChatCorpServiceAPI(constant.smartStationSuite.suiteID,
            constant.smartStationSuite.suiteSecret,
            suiteTicket.ticket,
            getToken,
            saveToken);
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