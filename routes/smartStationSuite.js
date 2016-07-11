'use strict';
var _ = require('underscore');
var express = require('express');
var weChatCorpServiceCcallbackM = require('wechat-corp-service-callback');
var WeChat = require('gridvo-wechat');

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
    var constant = WeChat.constant;
    var _config = {
        token: constant.token,
        encodingAESKey: constant.encodingAESKey,
        suiteid: constant.smartStationSuite.suiteID
    };
    var _handler = function (message, req, res, next) {
        if (message.InfoType == 'suite_ticket') {
            console.log("wechat server push suite_ticket event");
            let suiteTicketManageService = WeChat.createSuiteTicketManageService();
            var suiteTicketData = {};
            suiteTicketData.suiteID = constant.smartStationSuite.suiteID;
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
            var auth_code = message.AuthCode;

            res.reply('success');
        } else {
            res.reply('success');
        }
    };
    weChatCorpServiceCcallbackM(_config, _handler)(req, res, next);
});

router.get('/corp-auth-complete', function (req, res) {
    console.log("corp auth complete");
    var auth_code = req.query.auth_code;
    console.log(auth_code);
});

module.exports = router;