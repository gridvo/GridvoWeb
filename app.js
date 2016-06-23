'use strict';
var express = require('express');
var weChatRoute = require('./routes/weChat');
var waterStationRoute = require('./routes/waterStation');

var app = express();
app.use(express.static(__dirname + '/public'));
var options = {
    root: __dirname + '/public/'
};
app.use('/wechat', weChatRoute);
app.use('/wechat/smart-station-suite/water', waterStationRoute);
app.get('/', function (req, res) {
    res.sendFile('main.html', options);
});
console.log("Web server has started.");
app.listen(80);