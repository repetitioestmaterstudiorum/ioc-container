import { Db } from '/src/Modules/Db/Db'
import { Config } from '/src/Modules/Config/Config'
import type { Constants } from '/types/t.constants'
import { MongoClient } from 'mongodb'

// ---

/* 
- this container holds all modules
- getting a module: Container.get<ModuleTypes['Db']>('Db')
*/
class IOCContainer {
	private C: Constants
	private modules = new Map<string, unknown>()

	constructor(C: Constants) {
		this.C = C
	}

	public get<T>(moduleName: string) {
		if (!this.modules.has(moduleName)) {
			const errMsg = `module ${moduleName} does not exist in the container`
			console.error(errMsg)
			throw new Error(errMsg)
		}
		return this.modules.get(moduleName) as T
	}

	public registerModule(moduleName: string, module: unknown) {
		console.info(`addModule(): ${moduleName}`)
		if (this.C.app.port !== 'test' && this.modules.has(moduleName)) {
			const errMsg = `module ${moduleName} already registered`
			console.error(errMsg)
			throw new Error(errMsg)
		}
		this.modules.set(moduleName, module)
	}
}

export let Container: IOCContainer

/*
- each module that should be available in the container must be added here
- add their type to the ModuleTypes object also
- these will be the only instances of these modules in circulation
*/

export type ModuleTypes = {
	Db: Db
	Config: Config
}

export async function initContainer(C: Constants) {
	try {
		// set up the container itself
		Container = new IOCContainer(C)

		// set up the DbModule (special case)
		const dbClient = new MongoClient(C.db.url)
		Container.registerModule('Db', new Db(dbClient, C))
		const DbModule = Container.get<ModuleTypes['Db']>('Db')
		await DbModule.connectDb()

		// set up regular modules
		Container.registerModule('Config', new Config())

		console.info('addAllModules() added all modules')
	} catch (e) {
		console.error(e)
	}
}
