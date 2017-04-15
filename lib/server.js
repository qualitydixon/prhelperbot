'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _prhelperbot = require('./prhelperbot');

var _prhelperbot2 = _interopRequireDefault(_prhelperbot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var prBot = new _prhelperbot2.default();

app.use(_bodyParser2.default.json());

app.all('/', function (req, res) {
	res.send('Hello!');
	console.log('request action:', req);
	console.log('**********************');
});

app.post('/payload', function (req, res) {
	res.status(200).send('OK');
	console.log('request action:', req.body.action);
	console.log('**********************');
	console.log('request data', req.body.pull_request);
	var prData = req.body.pull_request;
	var action = req.body.action;
	if (action === 'opened' || action === 'reopened' || action === 'closed') {
		prBot.sendMessage({
			action: action,
			prData: prData
		});
	}
});

app.post('/pr', function (req, res) {
	res.status(200).send('OK');
	console.log('request:', req);
	console.log('**********************');
	console.log('request body:', req.body);
	console.log('**********************');
});

app.listen(process.env.PORT || 4000, function () {
	console.log('Listening');
	prBot.start();
});