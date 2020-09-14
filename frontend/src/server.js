import * as sapper from '@sapper/server'
import compression from 'compression'
import express from 'express'
import cookieSession from 'cookie-session'
import sirv from 'sirv'
import { auth } from 'express-openid-connect'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'

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
		})
	)
	.use(
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
			redirectUriPath: '/callback',
			handleCallback: async function (req, res, next) {
				req.session.openidTokens = req.openidTokens

				next()
			},
		})
	)
	.use(async (req, res, next) => {
		const tokenSet = req.openid.makeTokenSet(req.session.openidTokens)

		const { access_token, token_type } = tokenSet

		if (!access_token) {
			next()
			return
		}

		if (req.isAuthenticated()) {
			try {
				const response = await fetch(
					'http://localhost:4000/profile/my',
					{
						headers: {
							Authorization: token_type + ' ' + access_token,
						},
					}
				)

				const body = await response.json()

				req.session.userData = body
			} catch (e) {
				// console.log(e)
			}
		}

		next()
	})
	.use((req, res, next) => {
		return sapper.middleware({
			session: () => {
				console.log(req.isAuthenticated())

				return {
					isAuthenticated: req.isAuthenticated(),
					user: req.session.userData,
				}
			},
		})(req, res, next)
	})
	.listen(PORT, (err) => {
		if (err) console.log('error', err)
	})
