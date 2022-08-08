import _ from 'lodash'
import { Container, ModuleTypes } from '/src/Modules/Container'
import type { DefaultConfig } from '/types/t.defaultConfig'
import { NestedKeyOf } from '/types/utilityTypes'

// ---

/*
- this service allows for a config paradigm that always first checks if the config key is in the db, and if not, uses the fallback (default) config in the code
- this requires that every configuration has a default config in the Config object
*/

export class Config {
	private defaultConfig

	constructor(defaultConfig: DefaultConfig) {
		this.defaultConfig = defaultConfig
	}

	public async get(name: NestedKeyOf<typeof this.defaultConfig>) {
		const DbModule = Container.get<ModuleTypes['Db']>('Db')
		const ConfigCollection = DbModule.getCollection('config')
		const dbConfig = await ConfigCollection.raw.findOne({ name })
		return dbConfig?.config || _.get(this.defaultConfig, name)
	}
}
