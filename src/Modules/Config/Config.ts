import _ from 'lodash'
import { Container, ModuleTypes } from '/src/Modules/ioc-container'
import { NestedKeyOf } from '/types/utilityTypes'

// ---

export class Config {
	private config

	constructor() {
		// default / fallback config
		this.config = {
			app: {
				port: process.env.PORT || '8080',
				environment: process.env.NODE_ENV || 'development',
			},
			someSetting: {
				xyz: 'hurray',
			},
		}
	}

	public async get(name: NestedKeyOf<typeof this.config>) {
		const DbModule = Container.get<ModuleTypes['Db']>('Db')
		const ConfigCollection = DbModule.collection('config')
		const dbConfig = await ConfigCollection.findOne({ name })
		return dbConfig?.config || _.get(this.config, name)
	}
}
