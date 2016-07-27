'use strict';
var _ = require('underscore');
var async = require('async');
var express = require('express');
var WeChat = require('gridvo-wechat');

var callBackURLAuthService = WeChat.createCallBackURLAuthService();
var parseCallBackDataService = WeChat.createParseCallBackDataService();
var authCorpManageService = WeChat.createAuthCorpManageService();
var corpUserManageService = WeChat.createCorpUserManageService();
var constant = WeChat.constant;
var smartStationSuite = "tj75d1122acf5ed4aa";
var router = express.Router();
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
        Buffer.concat(buffers);
        var parseParameter = {};
        parseParameter.signature = req.query.msg_signature;
        parseParameter.timestamp = req.query.timestamp;
        parseParameter.nonce = req.query.nonce;
        parseParameter.cbXMLString = buffers.toString('utf-8');
        parseCallBackDataService.parse(parseParameter, (err, data)=> {
            res.send("");
            console.log(data);
        });
    });
    req.once('error', ()=> {
        res.send("");
    });
});
router.get('/corp-user-auth', function (req, res) {
    var code = req.query.code;
    var corpID = req.query.state;
    async.waterfall([function (cb) {
        authCorpManageService.getAuthCorpLatesSuiteAccessToken(corpID, constant[smartStationSuite].suiteID, cb);
    }, function (accessToken, cb) {
        if (_.isNull(accessToken)) {
            res.end();
            return;
        }
        corpUserManageService.getUserIDByCode(accessToken, code, cb);
    }], function (err, userID) {
        if (err) {
            res.end();
            return;
        }
        if (!userID) {
            res.end();
            return;
        }
        else {
            res.cookie('accountID', userID, {domain: 'pascal.gridvo.com'});
            res.cookie('accountTpye', 'WeChatCorp', {domain: 'pascal.gridvo.com'});
            var uiURL = `http://pascal.gridvo.com/wechat/ui/smart-station-suite/water`;
            res.redirect(uiURL);
        }
    });
});
module.exports = router;