import fetch from 'node-fetch'

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

		response = await fetch('http://localhost:4000/tasks/auth', {
			headers: {
				Authorization: token_type + ' ' + access_token,
			},
		})
	} else {
		response = await fetch('http://localhost:4000/tasks')
	}

	res.json(await response.json())
	res.end()
}
