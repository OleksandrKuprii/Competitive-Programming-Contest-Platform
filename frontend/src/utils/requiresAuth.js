function makeAuthorizedFetcher(fetch, Authorization) {
	return function (uri, params) {
		return fetch(uri, {
			...params,
			headers: { Authorization, ...(params || {}).headers },
		})
	}
}

async function requiresAuth(thatFetch, session, fn) {
	try {
		if (!session.isAuthenticated) {
			return { error: { type: 'unauthhorized' } }
		}

		if (!session.token) {
			return { error: { type: 'token' } }
		}

		const response = await fn(
			makeAuthorizedFetcher(thatFetch, session.token)
		)

		if (!response.ok) {
			return {
				error: { type: 'responseStatus', status: response.status },
			}
		}

		return { error: false, json: await response.json() }
	} catch (e) {
		return { error: { type: 'unknown', e } }
	}
}

export default requiresAuth
