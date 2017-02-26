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
		// this.prBot.postMessageToGroup('cinebody-platform', 'Hi Friends!')
	}

	sendMessage ({ action, prData, prUrl, title, description, reviewers, user, aviUrl, head, base, isMerged }) {
		const params = (action === 'opened' || action === 'reopened')
			? {
				'link_names': '1',
				'attachments':
				[
					{
						'fallback': 'A Pull Request was opened :smile:',
						'color': '#00BDF2',
						'pretext': 'A Pull Request was opened :smile:',
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
			}
			: {}
		// this.prBot.postMessageToUser('mike', getMessageText(action, prData.merged), params)
		this.prBot.postMessageToGroup('cinebody-platform', getMessageText(action, prData.merged), params)
	}
}
