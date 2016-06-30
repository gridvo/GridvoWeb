'use strict';
var express = require('express');
var corpAuthSuiteRoute = require('./routes/corpAuthSuite');
var smartStationSuiteRoute = require('./routes/smartStationSuite');
var waterStationRoute = require('./routes/waterStation');

var app = express();
app.use(express.static(__dirname + '/public'));
var options = {
    root: __dirname + '/public/'
};
app.use('/wechat/corp-auth-suite', corpAuthSuiteRoute);
app.use('/wechat/smart-station-suite', smartStationSuiteRoute);
app.use('/wechat/smart-station-suite/water', waterStationRoute);
app.get('/', function (req, res) {
    res.sendFile('main.html', options);
});
console.log("Web server has started.");
app.listen(80);