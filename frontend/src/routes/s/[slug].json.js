import fetch from 'node-fetch'
import backendURI from '~/utils/backendURI'

export async function get(req, res) {
	const tokenSet = req.openid.makeTokenSet(req.session.openidTokens)

	const { access_token, token_type } = tokenSet

	if (!access_token) {
		res.redirect('/login')
		res.end()
		return
	}

	const response = await fetch(
		`${backendURI}/submission/${req.params.slug}`,
		{
			headers: {
				Authorization: token_type + ' ' + access_token,
			},
		}
	)

	if (response.status !== 200) {
		res.status(response.status)
		res.write(response.status.toString())
		res.end()
		return
	}

	const submission = await response.json()

	res.json(submission)
	res.end()
}
