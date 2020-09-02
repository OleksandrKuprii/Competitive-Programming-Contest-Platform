import * as sapper from '@sapper/server'
import compression from 'compression'
import express from 'express'
import cookieSession from 'cookie-session'
import sirv from 'sirv'
import { auth } from 'express-openid-connect'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'

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
            keys: [
                'Qa9NKG8whyEDd-dH3xxegQGp_3zPzZc5xUdHspu0XIZeQusmHENAAde4K6Ks8iuw',
            ],
            // Sets the session cookie to expire after 7 days.
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
    )
    .use(
        auth({
            authorizationParams: {
                response_type: 'code id_token',
                audience: 'toucan-api',
            },
            required: false,
            auth0Logout: true,
            baseURL: 'http://localhost:3000',
            issuerBaseURL: 'https://dev-gly-dk66.eu.auth0.com',
            clientID: 'w5IiSiIhAoOW8dQvAATlvbaS2eP47H0Q',
            clientSecret:
                'Qa9NKG8whyEDd-dH3xxegQGp_3zPzZc5xUdHspu0XIZeQusmHENAAde4K6Ks8iuw',
            appSession: {
                secret:
                    'Qa9NKG8whyEDd-dH3xxegQGp_3zPzZc5xUdHspu0XIZeQusmHENAAde4K6Ks8iuw',
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
