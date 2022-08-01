import { Db as MongoDb, MongoClient } from 'mongodb'
import { CustomCollection } from '/src/Modules/Db/CustomCollection'

// ---

export class Db extends MongoDb {
	private customCollections = new Map<string, CustomCollection>()

	constructor(dbClient: MongoClient, dbName: string) {
		super(dbClient, dbName)
	}

	public getCollection(collectionName: string) {
		if (!this.customCollections.has(collectionName)) {
			this.customCollections.set(collectionName, new CustomCollection(this, collectionName))
		}
		return this.customCollections.get(collectionName) as CustomCollection
	}
}
