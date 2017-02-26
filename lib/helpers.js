'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getSlackName = getSlackName;
exports.getAttachmentMessage = getAttachmentMessage;
exports.getMessageText = getMessageText;
exports.getReviewers = getReviewers;
var githubToSlack = exports.githubToSlack = {
	qualitydixon: 'mike',
	kengoldfarb: 'ken',
	corbanb: 'corban',
	jtini: 'jeremy',
	Zoezter: 'zoe',
	RobinNCain: 'robin',
	BrandonMinch: 'brandon',
	ipbrennan90: 'ian'
};

function getSlackName(ghUser) {
	return githubToSlack[ghUser];
}

function getAttachmentMessage(action, isMerged) {
	switch (action) {
		case 'opened':
			return 'A new Pull Request was opened!';
		default:
			return 'There\'s new Pull Request Activity!';
	}
}

function getMessageText(action, isMerged) {
	if (action === 'closed' && isMerged) {
		return 'A Pull Request was merged!! :party:';
	}

	switch (action) {
		case 'reopened':
		case 'opened':
			return '';
		case 'closed':
			return 'A Pull Request was closed but not merged :confused:';
		case 'review_requested':
			return 'A review has been requested. :astonished:';
		default:
			return 'There is new Pull Request Activity';
	}
}

function getReviewers(reviewers) {
	return reviewers.map(function (rev) {
		return '@' + getSlackName(rev.login);
	}).join(' ');
}