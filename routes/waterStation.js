'use strict';
var _ = require('underscore');
var express = require('express');
var WeChatCrypto = require('wechat-crypto');

var router = express.Router();
router.get('/user-event', function (req, res) {
    console.log(req.query);
});

module.exports = router;