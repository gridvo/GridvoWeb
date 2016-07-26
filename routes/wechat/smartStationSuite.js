'use strict';
var _ = require('underscore');
var async = require('async');
var express = require('express');
var weChatCorpServiceCcallbackM = require('wechat-corp-service-callback');
var WeChat = require('gridvo-wechat');

var suiteTicketManageService = WeChat.createSuiteTicketManageService();
var suiteAccessTokenManageService = WeChat.createSuiteAccessTokenManageService();
var corpAuthSuiteService = WeChat.createCorpAuthSuiteService();
var authCorpManageService = WeChat.createAuthCorpManageService();
var authCorpSuiteProxyService = WeChat.createAuthCorpSuiteProxyService();
var constant = WeChat.constant;
var smartStationSuite = "tj75d1122acf5ed4aa";
var router = express.Router();
router.get('/sys-event', function (req, res) {
    let isWeChatServerAuthURL = !_.isUndefined(req.query.echostr);
    if (isWeChatServerAuthURL) {
        let callBackURLAuthService = WeChat.createCallBackURLAuthService();
        var authParameter = {};
        authParameter.signature = req.query.msg_signature;
        authParameter.timestamp = req.query.timestamp;
        authParameter.nonce = req.query.nonce;
        authParameter.encrypt = req.query.echostr;
        callBackURLAuthService.authURL(authParameter, function (err, echostr) {
            if (err) {
                console.log(err);
                return;
            }
            res.send(echostr);
        });
    } else {
        console.log("WeChat server had auth this URL");
    }
});

router.post('/sys-event', function (req, res, next) {
    var _config = {
        token: constant.token,
        encodingAESKey: constant.encodingAESKey,
        suiteid: constant[smartStationSuite].suiteID
    };
    var _handler = function (message, req, res, next) {
        if (message.InfoType == 'suite_ticket') {
            console.log("wechat server push suite_ticket event");
            let suiteTicketManageService = WeChat.createSuiteTicketManageService();
            var suiteTicketData = {};
            suiteTicketData.suiteID = constant[smartStationSuite].suiteID;
            suiteTicketData.ticket = message.SuiteTicket;
            suiteTicketManageService.saveSuiteTicket(suiteTicketData, function (err, isSuccess) {
                if (_.isNull(err) && isSuccess) {
                    res.reply('success');
                }
            });
        } else if (message.InfoType == 'change_auth') {
            console.log("wechat server push change_auth event");
            res.reply('success');

        } else if (message.InfoType == 'cancel_auth') {
            console.log("wechat server push cancel_auth event");
            res.reply('success');
        } else if (message.InfoType == 'create_auth') {
            console.log("corp auth complete");
            var authCode = message.AuthCode;
            var authCorpID;
            async.waterfall([function (cb) {
                corpAuthSuiteService.getAuthCorpSuiteInfo(constant[smartStationSuite].suiteID, authCode, cb);
            }, function (authCorpSuiteInfoData, cb) {
                if (_.isNull(authCorpSuiteInfoData)) {
                    res.end();
                    return;
                }
                authCorpID = authCorpSuiteInfoData.corpID;
                authCorpSuiteInfoData.suiteID = constant[smartStationSuite].suiteID;
                authCorpSuiteInfoData.expire = new Date((new Date()).getTime() + 7190000);
                authCorpManageService.saveAuthCorpSuiteInfo(authCorpSuiteInfoData, cb);
            }, function (isSuccess, cb) {
                if (!isSuccess) {
                    res.end();
                    return;
                }
                var suiteID = constant[smartStationSuite].suiteID;
                var appID = "1";
                var appContent = constant[smartStationSuite][appID].appContent;
                authCorpSuiteProxyService.createSuiteApp(authCorpID, suiteID, appID, appContent, cb);
            }], function (err, isSuccess) {
                if (err) {
                    res.end();
                    return;
                }
                if (isSuccess) {
                    res.reply('success');
                    console.log("create suite app success");
                }
                else {
                    res.end();
                    console.log("create suite app fail");
                }
            });
        } else {
            res.reply('success');
        }
    };
    weChatCorpServiceCcallbackM(_config, _handler)(req, res, next);
});

router.get('/corp-auth-complete', function (req, res) {
    console.log("corp auth complete");
    var authCode = req.query.auth_code;
    console.log(authCode);
});

module.exports = router;