import express from 'express'
import bodyParser from 'body-parser'
import PRHelperBot from './prhelperbot'

const app = express()
const prBot = new PRHelperBot()

app.use(bodyParser.urlencoded())

app.all('/', function(req, res) {
	res.send('Hello!')
	console.log('request action:', req)
	console.log('**********************')
})

app.post('/payload', (req, res) => {
	res.status(200).send('OK')
	console.log('request action:', req.body.action)
	console.log('**********************')
	console.log('request data', req.body.pull_request)
	const prData = req.body.pull_request
	const action = req.body.action
	const repo = req.body.pull_request.base.repo.name
	if (action === 'opened' || action === 'reopened' || action === 'closed') {
		prBot.sendMessage({
			action,
			prData,
			repo,
		})
	}
})

app.post('/pr', (req, res) => {
	if (req.body.token !== process.env.SLACK_APP_TOKEN) {
		res.status(500).send('Request token invalid')
	}
	res.status(200).send('OK')
	console.log('request:', req)
	console.log('**********************')
	console.log('request body:', req.body)
	console.log('**********************')
})

app.listen(process.env.PORT || 4000, function() {
	console.log('Listening')
	prBot.start()
})
