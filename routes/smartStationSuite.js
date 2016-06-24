'use strict';
var _ = require('underscore');
var express = require('express');
var weChatCorpServiceCcallbackM = require('wechat-corp-service-callback');
var WeChatAPI = require('../lib/weChatAPI');
var constant = require('../lib/util/constant');
var SuiteTicket = require('../lib/util/suiteTicket');

var router = express.Router();

router.get('/sys-event', function (req, res) {
    let isWeChatServerAuthURL = !_.isUndefined(req.query.echostr);
    if (isWeChatServerAuthURL) {
        WeChatAPI.weChatServerAuthCallBackURL(req, res);
    } else {
        console.log("WeChat server had auth this URL");
    }
});

router.post('/sys-event', function (req, res, next) {
    let _config = {
        token: constant.token,
        encodingAESKey: constant.encodingAESKey,
        suiteid: constant.suiteID
    };
    let _handler = function (message, req, res, next) {
        if (message.InfoType == 'suite_ticket') {
            console.log("wechat server push suite_ticket event");
            var suiteTicket = message.SuiteTicket;
            SuiteTicket.save(suiteTicket, function (err, result) {
                if (_.isNull(err) && result.isSuccess) {
                    res.reply('success');
                }
            });
        } else if (message.InfoType == 'change_auth') {
            res.reply('success');

        } else if (message.InfoType == 'cancel_auth') {
            res.reply('success');
        } else {
            res.reply('success');
        }
    };
    weChatCorpServiceCcallbackM(_config, _handler)(req, res, next);
});

module.exports = router;