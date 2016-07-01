'use strict';
var _ = require('underscore');
var express = require('express');
var WeChat = require('gridvo-wechat');

var router = express.Router();
router.get('/user-event', function (req, res) {
    var isWeChatServerAuthURL = !_.isUndefined(req.query.echostr);
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

module.exports = router;