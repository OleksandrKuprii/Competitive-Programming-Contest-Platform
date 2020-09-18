import fetch from 'node-fetch'
import backendURI from '~/utils/backendURI'

export async function get(req, res) {
	let response

	if (
		req.session.isAuthenticated === true &&
		req.session.userData !== undefined &&
		req.session.userData.registered
	) {
		const tokenSet = req.openid.makeTokenSet(req.session.openidTokens)

		const { access_token, token_type } = tokenSet

		if (!access_token) {
			res.status(403)
			res.end()
			return
		}

		response = await fetch(`${backendURI}/tasks/auth?number=999&offset=0`, {
			headers: {
				Authorization: token_type + ' ' + access_token,
			},
		})
	} else {
		response = await fetch(`${backendURI}/tasks?number=999&offset=0`)
	}

	const tasks = await response.json()

	res.json(tasks)
	res.end()
}
