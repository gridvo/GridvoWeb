'use strict';
var _ = require('underscore');
var express = require('express');
var WeChatCrypto = require('wechat-crypto');

var router = express.Router();
router.get('/user-event', function (req, res) {
    var corpID = "wx9b41eed392c6d447";
    var token = "GuEccJzML5RxVB8fLhhzRPBda5aJNw5J";
    var encodingAESKey = "FWj4LPoWHVbHglyHnxC4gifhjFfOn89hfYXMH3Y7N9b";
    var weChatCrypto = new WeChatCrypto(token, encodingAESKey, corpID);
    var signature = req.query.msg_signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var isWeChatServerAuthURL = !_.isUndefined(req.query.echostr);
    if (isWeChatServerAuthURL) {
        let encrypt = req.query.echostr;
        let auth_signature = weChatCrypto.getSignature(timestamp, nonce, encrypt);
        if (signature == auth_signature) {
            let echostr = weChatCrypto.decrypt(encrypt);
            res.send(echostr.message);
        }
    } else {
        console.log("user event");
    }
});

module.exports = router;