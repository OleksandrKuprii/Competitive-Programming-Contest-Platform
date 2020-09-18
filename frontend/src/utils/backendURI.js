import env from '~/env.js'

export default process.browser ? env.backendURIExternal : env.backendURIInternal
