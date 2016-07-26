'use strict';
var _ = require('underscore');
var express = require('express');
var bodyParser = require('body-parser');
var WeChat = require('gridvo-wechat');

var callBackURLAuthService = WeChat.createCallBackURLAuthService();
var router = express.Router();
router.use(bodyParser.raw());
router.get('/user-event', function (req, res) {
    var isWeChatServerAuthURL = !_.isUndefined(req.query.echostr);
    if (isWeChatServerAuthURL) {
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
router.post('/user-event', function (req, res) {
    var buffers = [];
    req.on('data', function (trunk) {
        buffers.push(trunk);
    });
    req.on('end', function () {
        console.log(Buffer.concat(buffers).toString());
    });
    req.once('error', ()=> {
    });
});

module.exports = router;