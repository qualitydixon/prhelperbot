'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slackbots = require('slackbots');

var _slackbots2 = _interopRequireDefault(_slackbots);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (_fs2.default.existsSync('./.env')) require('dotenv').config({ path: './.env' });

var settings = {
	token: process.env.API_TOKEN,
	name: 'prhelperbot'
};

var PRHelperBot = function () {
	function PRHelperBot() {
		_classCallCheck(this, PRHelperBot);

		this.prBot = new _slackbots2.default(settings);
	}

	_createClass(PRHelperBot, [{
		key: 'start',
		value: function start() {
			// this.prBot.postMessageToUser('mike', 'I\'m just getting started')
		}
	}, {
		key: 'sendMessage',
		value: function sendMessage(_ref) {
			var action = _ref.action,
			    prData = _ref.prData;

			if (action === 'opened' || action === 'reopened') {
				this.prBot.postMessageToGroup('cinebody-platform', '', openedAttachment(prData));
			} else if (action === 'closed' && prData.merged) {
				this.prBot.postMessageToGroup('cinebody-platform', '', closedAttachment(prData));
			}
		}
	}]);

	return PRHelperBot;
}();

exports.default = PRHelperBot;


var openedAttachment = function openedAttachment(prData) {
	var fields = prData.requested_reviewers.length > 0 ? [{
		title: 'Reviewers',
		value: (0, _helpers.getReviewers)(prData.requested_reviewers),
		short: true
	}] : [];
	return {
		link_names: '1',
		as_user: 'true',
		attachments: [{
			fallback: (0, _helpers.getSlackName)(prData.user.login) + ' opened a pull request',
			color: '#00BDF2',
			pretext: '',
			author_name: '' + (0, _helpers.getSlackName)(prData.user.login),
			author_link: 'https://github.com/' + prData.user.login,
			author_icon: prData.user.avatar_url,
			title: prData.title,
			title_link: prData.html_url,
			text: prData.body,
			fields: fields
		}]
	};
};

var closedAttachment = function closedAttachment(prData) {
	var message = prData.merged_by !== null ? (0, _helpers.getSlackName)(prData.merged_by.login) + ' merged ' + (0, _helpers.getSlackName)(prData.user.login) + '\'s pull request.' : 'A pull request was merged.';
	return {
		link_names: '1',
		as_user: 'true',
		attachments: [{
			fallback: message,
			color: '#6F42C1',
			text: message + ' You rock!'
		}]
	};
};

var warnAttachment = function warnAttachment(prData) {
	return {
		link_names: '1',
		as_user: 'true',
		attachments: [{
			fallback: 'A pull request is getting stale',
			color: '#E8412F',
			title: 'The following pull request has been open for over two hours. Please consider reviewing.'
		}]
	};
};