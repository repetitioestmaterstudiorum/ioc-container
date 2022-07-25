import _ from 'lodash'
import { Container, ModuleTypes } from '/src/Modules/ioc-container'
import { NestedKeyOf } from '/types/utilityTypes'

// ---

/*
- this service allows for a config paradigm that always first checks if the config key is in the db, and if not, uses the fallback (default) config in the code
- this requires that every configuration has a default config in the Config object
*/

export class Config {
	private config

	constructor() {
		// default / fallback config
		this.config = {
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
