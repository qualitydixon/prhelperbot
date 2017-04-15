import * as helpers from '../helpers'

test('Github name conversion', () => {
	expect(helpers.getSlackName('qualitydixon')).toBe('mike')
})
