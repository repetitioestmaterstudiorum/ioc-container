import type { Constants } from '/types/t.constants'

// ---

// All the unchangeable (in runtime) configuration goes here. Everything else -> ConfigModule

export const C: Readonly<Constants> = {
	app: {
		port: process.env.PORT || '8080',
		environment: process.env.NODE_ENV || 'development',
	},
	db: {
		url: process.env.MONGO_URL || 'mongodb://localhost:27017',
		name: 'ioc-container',
	},
}
