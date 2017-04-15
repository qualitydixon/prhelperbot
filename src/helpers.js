import { ghToSlack, repoToChannel } from './config'

export function getSlackName(ghUser) {
	return ghToSlack[ghUser]
}

export function getChannelName(repo) {
	return repoToChannel[repo]
}

export function getAttachmentMessage(action, isMerged) {
	switch (action) {
		case 'opened':
			return 'A new Pull Request was opened!'
		default:
			return "There's new Pull Request Activity!"
	}
}

export function getMessageText(action, isMerged) {
	if (action === 'closed' && isMerged) {
		return 'A Pull Request was merged!! :party:'
	}

	switch (action) {
		case 'reopened':
		case 'opened':
			return ''
		case 'closed':
			return 'A Pull Request was closed but not merged :confused:'
		case 'review_requested':
			return 'A review has been requested. :astonished:'
		default:
			return 'There is new Pull Request Activity'
	}
}

export function getReviewers(reviewers) {
	return reviewers.map(rev => `@${getSlackName(rev.login)}`).join(' ')
}
