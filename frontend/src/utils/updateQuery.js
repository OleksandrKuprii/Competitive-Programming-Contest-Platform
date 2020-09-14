/**
 * maps object to URLSearchParams
 * @date 2020-09-12
 * @param {object} a
 * @returns {URLSearchParams}
 */
function mapToSearchParams(a) {
	const params = new URLSearchParams()

	Object.entries(a).forEach(([k, v]) => params.set(k, v))

	return params
}

/**
 * updates url query without page reload
 * uses history.pushState, so can be not supported by some
 * browsers.
 *
 * @date 2020-09-12
 * @param {object} query
 * @returns {void}
 */
function updateQuery(query) {
	const newurl =
		window.location.protocol +
		'//' +
		window.location.host +
		window.location.pathname +
		'?' +
		mapToSearchParams(query).toString()

	window.history.pushState({ path: newurl }, '', newurl)
}

export default updateQuery
