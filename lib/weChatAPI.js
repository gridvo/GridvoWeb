'use strict';
var WeChatCrypto = require('wechat-crypto');
var constant = require('./util/constant');

var API = {};
API.weChatServerAuthCallBackURL = function (req, res) {
    let weChatCrypto = new WeChatCrypto(constant.token, constant.encodingAESKey, constant.corpID);
    let signature = req.query.msg_signature;
    let timestamp = req.query.timestamp;
    let nonce = req.query.nonce;
    let encrypt = req.query.echostr;
    let auth_signature = weChatCrypto.getSignature(timestamp, nonce, encrypt);
    if (signature == auth_signature) {
        let echostr = weChatCrypto.decrypt(encrypt);
        res.send(echostr.message);
    }
};

module.exports = API;