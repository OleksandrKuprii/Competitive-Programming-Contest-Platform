import fetch from 'node-fetch'
import { backendURI } from '~/env'

export async function post(req, res) {
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

	const response = await fetch(`${backendURI}/submission`, {
		method: 'POST',
		headers: {
			Authorization: token_type + ' ' + access_token,
		},
		body: JSON.stringify({
			alias: req.params.slug,
			code: req.body.code,
			lang: req.body.lang,
		}),
	})

	const body = await response.json()

	res.redirect(`/s/${body.submission_id}`)
	res.end()
}
