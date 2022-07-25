import { connectDbClient } from '/src/Modules/Db/Db'
import { Container, initContainer } from '/src/Modules/ioc-container'
import type { ModuleTypes } from '/src/Modules/ioc-container'

// ---

// startup function
async function startup() {
	// initialize the db client connection and the IoC container
	await connectDbClient()
	await initContainer()

	// DbModule demo
	const DbModule = Container.get<ModuleTypes['Db']>('Db')

	const collections = await DbModule.listCollections().toArray()

	const TestCollection = DbModule.getCollection('test')
	if (collections.find(c => c.name === 'test')) {
		await TestCollection.raw.drop()
	}
	await TestCollection.insertOne({ test: true })
	const testData = await TestCollection.raw.find().toArray()
	console.log('testData', testData)

	// ConfigModule demo
	const configCollExists = !!collections.find(c => c.name === 'config')
	if (!configCollExists) DbModule.createCollection('config')
	const ConfigCollection = DbModule.getCollection('config')
	if (configCollExists) ConfigCollection.raw.drop()
	await ConfigCollection.insertOne({ name: 'someSetting.xyz', config: 'db config' })
	const ConfigModule = Container.get<ModuleTypes['Config']>('Config')
	const someSettingXyz = await ConfigModule.get('someSetting.xyz')
	console.log('someSettingXyz', someSettingXyz)
}
startup()
