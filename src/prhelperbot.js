import Bot from 'slackbots'
import fs from 'fs'
import { getSlackName, getMessageText, getReviewers } from './helpers'

if (fs.existsSync('./.env')) require('dotenv').config({path: './.env'})

const settings = {
	token: process.env.API_TOKEN,
	name: 'prhelperbot'
}

export default class PRHelperBot {
	constructor () {
		this.prBot = new Bot(settings)
	}

	start () {
		this.prBot.postMessageToUser('mike', 'I\'m just getting started')
	}

	sendMessage ({ action, prData, prUrl, title, description, reviewers, user, aviUrl, head, base, isMerged }) {
		if (action === 'opened' || action === 'reopened') {
			this.prBot.postMessageToGroup('cinebody-platform', '', openedAttachment(prData))
		} else if (action === 'closed' && isMerged) {
			this.prBot.postMessageToGroup('cinebody-platform', '', closedAttachment(prData))
		}
	}
}

const openedAttachment = prData => ({
	'link_names': '1',
	'attachments':
	[
		{
			'fallback': 'A Pull Request was opened',
			'color': '#00BDF2',
			'pretext': '',
			'author_name': `${getSlackName(prData.user.login)}`,
			'author_link': `https://github.com/${prData.user.login}`,
			'author_icon': prData.user.avatar_url,
			'title': prData.title,
			'title_link': prData.html_url,
			'text': prData.body,
			'fields': [
				{
					'title': 'Head',
					'value': prData.head.ref,
					'short': true
				},
				{
					'title': 'Base',
					'value': prData.base.ref,
					'short': true
				},
				{
					'title': 'Reviewers',
					'value': getReviewers(prData.requested_reviewers),
					'short': true
				}
			]
		}
	]
})

const closedAttachment = prData => ({
	'link_names': '1',
	'attachments':
	[
		{
			'fallback': 'A pull request was merged by ',
			'color': '#6F42C1',
			'text': 'A pull request was merged by Mike'
		}
	]
})

const warnAttachment = prData => ({
	'link_names': '1',
	'attachments':
	[
		{
			'fallback': 'A pull request is getting stale',
			'color': '#E8412F',
			'title': 'The following pull request has been open for over two hours. Please consider reviewing.'
		}
	]
})
