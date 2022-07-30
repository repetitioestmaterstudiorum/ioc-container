import { Db } from '/src/Modules/Db/Db'
import { Config } from '/src/Modules/Config/Config'

// ---

/* 
- this container holds all modules
- getting a module: Container.get<ModuleTypes['Db']>('Db')
*/
export class IOCContainer {
	private modules = new Map<string, unknown>()

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
		if (this.modules.has(moduleName)) {
			const errMsg = `module ${moduleName} already registered`
			console.error(errMsg)
			throw new Error(errMsg)
		}
		this.modules.set(moduleName, module)
	}
}

export const Container = new IOCContainer()

// each module type the Container can hold must be added here

export type ModuleTypes = {
	Db: Db
	Config: Config
}
