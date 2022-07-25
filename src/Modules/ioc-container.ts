import { Db } from '/src/Modules/Db/Db'
import { Config } from '/src/Modules/Config/Config'
import { C } from '/src/constants'

// ---

/* 
- this container holds all modules
- getting a module: Container.get<ModuleTypes['Db']>('Db')
*/
class IOCContainer {
	private modules = new Map<string, unknown>()

	public get<T>(moduleName: string) {
		console.log('moduleName', moduleName)
		if (!this.modules.has(moduleName)) {
			const errMsg = `module ${moduleName} does not exist in the container`
			console.error(errMsg)
			throw new Error(errMsg)
		}
		return this.modules.get(moduleName) as T
	}

	public registerModule(moduleName: string, module: unknown) {
		console.info(`addModule(): ${moduleName}`)
		if (C.app.port !== 'test' && this.modules.has(moduleName)) {
			const errMsg = `module ${moduleName} already registered`
			console.error(errMsg)
			throw new Error(errMsg)
		}
		this.modules.set(moduleName, module)
	}
}

export const Container = new IOCContainer()

/*
- each module that should be available in the container must be added here
- add their type to the ModuleTypes object also
- these will be the only instances of these modules in circulation
*/

export type ModuleTypes = {
	Db: Db
	Config: Config
}

export async function initContainer() {
	try {
		Container.registerModule('Db', new Db())
		Container.registerModule('Config', new Config())

		console.info('addAllModules() added all modules')
	} catch (e) {
		console.error(e)
	}
}
