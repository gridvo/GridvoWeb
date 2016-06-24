'use strict';
var _ = require('underscore');
var express = require('express');
var weChatAPI = require('../lib/weChatAPI');

var router = express.Router();
router.get('/user-event', function (req, res) {
    var isWeChatServerAuthURL = !_.isUndefined(req.query.echostr);
    if (isWeChatServerAuthURL) {
        weChatAPI.weChatServerAuthCallBackURL(req, res);
    } else {
        console.log("user event");
    }
});

module.exports = router;