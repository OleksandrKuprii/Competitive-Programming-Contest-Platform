import fetch from 'node-fetch'
import backendURI from '~/utils/backendURI'

export async function get(req, res) {
	if (!req.isAuthenticated()) {
		res.redirect('/login')
		res.end()
		return
	}

	const tokenSet = req.openid.makeTokenSet(req.session.openidTokens)

	const { access_token, token_type } = tokenSet

	if (!access_token) {
		res.redirect('/login')
		res.end()
		return
	}

	const response = await fetch(
		`${backendURI}/submissions?offset=0&number=50`,
		{
			headers: {
				Authorization: token_type + ' ' + access_token,
			},
		}
	)

	const submissions = await response.json()

	res.json(submissions)
	res.end()
}
