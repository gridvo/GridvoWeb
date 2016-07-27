'use strict';
var express = require('express');
var ui = require('./routes/wechat/ui');
var corpAuthSuiteRoute = require('./routes/wechat/corpAuthSuite');
var smartStationSuiteRoute = require('./routes/wechat/smartStationSuite');
var waterStationRoute = require('./routes/wechat/smartStationSuite/waterStation');

var app = express();
app.use(express.static(__dirname + '/public'));
app.use('/wechat/ui', ui);
app.use('/wechat/corp-auth-suite', corpAuthSuiteRoute);
app.use('/wechat/smart-station-suite', smartStationSuiteRoute);
app.use('/wechat/smart-station-suite/water', waterStationRoute);
app.get('/', function (req, res) {
    res.send("content creating....");
});
console.log("Gridvo web server has started.");
app.listen(80);