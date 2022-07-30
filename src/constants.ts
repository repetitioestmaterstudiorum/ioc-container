import type { Constants } from '/types/t.constants'

// ---

// All the unchangeable (in runtime) configuration goes here. Everything else -> ConfigModule
const constants: Constants = {
	app: {
		port: process.env.PORT || '8080',
		environment: process.env.NODE_ENV || 'development',
	},
	db: {
		uri: process.env.MONGO_URI || 'mongodb://localhost:27017',
		name: 'ioc-container',
	},
}

export const C = Object.freeze(constants)
