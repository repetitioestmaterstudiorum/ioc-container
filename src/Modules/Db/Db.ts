import { Db as MongoDb, MongoClient } from 'mongodb'
import { C } from '/src/constants'
import { CustomCollection } from '/src/Modules/Db/CustomCollection'

// ---

// create client
const dbClient = new MongoClient(C.db.url)

export async function connectDbClient() {
	try {
		await dbClient.connect()
		console.info('connected successfully to server')
	} catch (e) {
		const errMsg = `couldn't connect to db`
		console.error(errMsg)
		throw new Error(errMsg)
	}
}

export class Db extends MongoDb {
	private customCollections = new Map<string, CustomCollection>()

	constructor() {
		super(dbClient, C.db.name)
	}

	public getCollection(collectionName: string) {
		if (!this.customCollections.has(collectionName)) {
			this.customCollections.set(collectionName, new CustomCollection(this, collectionName))
		}
		return this.customCollections.get(collectionName) as CustomCollection
	}
}
