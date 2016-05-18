var express = require('express');

var app = express();
app.use(express.static(__dirname + '/public'));
var options = {
    root: __dirname + '/public/'
};
app.get('/', function (req, res) {
    res.sendFile('main.html', options);
});
console.log("Web server has started.");
app.listen(8080);