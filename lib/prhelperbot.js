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
			this.prBot.postMessageToUser('mike', 'I\'m just getting started');
			// this.prBot.postMessageToGroup('cinebody-platform', 'Hi Friends!')
		}
	}, {
		key: 'sendMessage',
		value: function sendMessage(_ref) {
			var action = _ref.action,
			    prData = _ref.prData,
			    prUrl = _ref.prUrl,
			    title = _ref.title,
			    description = _ref.description,
			    reviewers = _ref.reviewers,
			    user = _ref.user,
			    aviUrl = _ref.aviUrl,
			    head = _ref.head,
			    base = _ref.base,
			    isMerged = _ref.isMerged;

			var params = action === 'opened' || action === 'reopened' ? {
				'link_names': '1',
				'attachments': [{
					'fallback': 'A Pull Request was opened :smile:',
					'color': '#00BDF2',
					'pretext': 'A Pull Request was opened :smile:',
					'author_name': '' + (0, _helpers.getSlackName)(prData.user.login),
					'author_link': 'https://github.com/' + prData.user.login,
					'author_icon': prData.user.avatar_url,
					'title': prData.title,
					'title_link': prData.html_url,
					'text': prData.body,
					'fields': [{
						'title': 'Head',
						'value': prData.head.ref,
						'short': true
					}, {
						'title': 'Base',
						'value': prData.base.ref,
						'short': true
					}, {
						'title': 'Reviewers',
						'value': (0, _helpers.getReviewers)(prData.requested_reviewers),
						'short': true
					}]
				}]
			} : {};
			// this.prBot.postMessageToUser('mike', getMessageText(action, prData.merged), params)
			this.prBot.postMessageToGroup('cinebody-platform', (0, _helpers.getMessageText)(action, prData.merged), params);
		}
	}]);

	return PRHelperBot;
}();

exports.default = PRHelperBot;