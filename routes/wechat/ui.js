'use strict';
var _ = require('underscore');
var async = require('async');
var express = require('express');
var cookieParser = require('cookie-parser');
var WeChat = require('gridvo-wechat');

var router = express.Router();
router.use(cookieParser());
router.get('/smart-station-suite/water', function (req, res) {
    //console.log(req.cookies);
    if (!req.cookies || !req.cookies.accountID || !req.cookies.accountTpye || req.cookies.accountTpye != "WeChatCorp") {
        res.send("请在微信客户端打开此网页.....");
        return;
    }
});

module.exports = router;