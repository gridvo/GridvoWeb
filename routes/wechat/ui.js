'use strict';
var _ = require('underscore');
var async = require('async');
var express = require('express');
var cookieParser = require('cookie-parser');
var WeChat = require('gridvo-wechat');

var router = express.Router();
router.use(cookieParser());
router.get('/smart-station-suite/water', function (req, res) {
    if (!req.cookies || !req.cookies.accountID || !req.cookies.accountTpye || req.cookies.accountTpye != "WeChatCorp") {
        var corpID = req.query.corpid;
        if (!corpID) {
            res.send("请在微信客户端打开此网页.....");
            return;
        }
        var corpUserAuthURI = 'http://pascal.gridvo.com:80/wechat/smart-station-suite/water/corp-user-auth';
        var redirectURL = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${corpID}&redirect_uri=${corpUserAuthURI}&response_type=code&scope=snsapi_base&state=${corpID}#wechat_redirect`;
        res.redirect(redirectURL);
        return;
    }
    res.send(req.cookies.accountID);
});

module.exports = router;