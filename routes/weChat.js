'use strict';
var _ = require('underscore');
var express = require('express');
var bodyParser = require('body-parser');
var WeChatCrypto = require('wechat-crypto');

var router = express.Router();
router.use(bodyParser.urlencoded({extended: false}));
router.get('/sysevent', function (req, res) {
    var corpID = "wx9b41eed392c6d447";
    var token = "GuEccJzML5RxVB8fLhhzRPBda5aJNw5J";
    var encodingAESKey = "FWj4LPoWHVbHglyHnxC4gifhjFfOn89hfYXMH3Y7N9b";
    var weChatCrypto = new WeChatCrypto(token, encodingAESKey, corpID);
    var signature = req.body.msg_signature;
    var timestamp = req.body.timestamp;
    var nonce = req.body.nonce;
    var isWeChatServerAuthURL = !_.isUndefined(req.body.echostr);
    if (isWeChatServerAuthURL) {
        let encrypt = req.body.echostr;
        let auth_signature = weChatCrypto.getSignature(timestamp, nonce, encrypt);
        if (signature == auth_signature) {
            let echostr = weChatCrypto.decrypt(encrypt);
            console.log(echostr);
        }
    } else {
        console.log("sys event");
    }
    res.send();
});

module.exports = router;