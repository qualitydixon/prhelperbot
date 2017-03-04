import express from 'express'
import bodyParser from 'body-parser'
import PRHelperBot from './prhelperbot'

const app = express()
const prBot = new PRHelperBot()


app.use(bodyParser.json())

app.all('/', function (req, res) {
	res.send('Hello World!')
})

app.post('/payload', (req, res) => {
	res.status(200).send('OK')
	console.log('request', req.body.action)
	const prData = req.body.pull_request
	const action = req.body.action
	if (action === 'opened' || action === 'reopened' || action === 'closed') {
		prBot.sendMessage({
			action,
			prData
		})
	}
})

app.listen(process.env.PORT || 4000, function () {
	console.log('Listening for PRs!')
	prBot.start()
})
