import * as sapper from '@sapper/server'
import compression from 'compression'
import express from 'express'
import cookieSession from 'cookie-session'
import sirv from 'sirv'
import { auth } from 'express-openid-connect'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'

import { backendURI } from './env'
import credentials from './credentials'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

express()
	.use(
		compression({ threshold: 0 }),
		bodyParser.urlencoded({ extended: true }),
		bodyParser.json(),
		bodyParser.raw(),
		sirv('static', { dev }),
		cookieSession({
			name: 'session',
			keys: credentials.cookieSession.secret,
			maxAge: 7 * 24 * 60 * 60 * 1000,
		}),
		auth({
			authorizationParams: {
				response_type: 'code id_token',
				audience: credentials.auth0.audience,
			},
			required: false,
			auth0Logout: true,
			baseURL: credentials.auth0.baseURL,
			issuerBaseURL: credentials.auth0.issuerBaseURL,
			clientID: credentials.auth0.clientID,
			clientSecret: credentials.auth0.clientSecret,
			appSession: {
				secret: credentials.appSession.secret,
			},
			handleCallback: async (req, res, next) => {
				const { token_type, access_token } = req.openid.makeTokenSet(
					req.openidTokens
				)
				req.session.token = `${token_type} ${access_token}`
				next()
			},
		}),
		profileDataMiddleware,
		loggerMiddleware,
		(req, res, next) =>
			sapper.middleware({
				session: () => ({
					isAuthenticated: req.session.isAuthenticated,
					user: req.session.userData,
					token: req.session.token,
				}),
			})(req, res, next)
	)
	.listen(PORT, (err) => {
		if (err) console.log('error', err)
	})

async function profileDataMiddleware(req, res, next) {
	if (!req.session.token) {
		next()
		return
	}

	if (!(req.session.isAuthenticated = req.isAuthenticated())) {
		req.session.token = undefined
		req.session.user = undefined
		next()
		return
	}

	const headers = { Authorization: req.session.token }

	try {
		const response = await fetch(`${backendURI}/profile/my`, { headers })

		const body = await response.json()

		req.session.userData = body
	} catch (e) {
		console.log(e)
		res.end(e)
		return
	}

	next()
}

function loggerMiddleware(req, res, next) {
	console.log(
		req.session.isAuthenticated,
		req.session.userData,
		req.session.token
	)

	next()
}
