import { MongoClient } from 'mongodb'
import { C } from '/src/constants'
import { defaultConfig } from '/src/Modules/Config/defaultConfig'
import { Db } from '/src/Modules/Db/Db'
import { Config } from '/src/Modules/Config/Config'
import { Container } from './Modules/Container'
import type { ModuleTypes } from './Modules/Container'

// ---

// startup function
async function startup() {
	// register all modules
	// set up the Db module (special case)
	const dbClient = new MongoClient(C.db.uri)
	await dbClient.connect()
	Container.registerModule('Db', new Db(dbClient, C.app.name))
	const DbModule = Container.get<ModuleTypes['Db']>('Db')

	// set up regular modules
	Container.registerModule('Config', new Config(defaultConfig))

	// DbModule demo
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
