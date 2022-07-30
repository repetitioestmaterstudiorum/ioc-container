import { Db as MongoDb, MongoClient } from 'mongodb'
import { CustomCollection } from '/src/Modules/Db/CustomCollection'
import { Constants } from '/types/t.constants'

// ---

export class Db extends MongoDb {
	private customCollections = new Map<string, CustomCollection>()

	constructor(dbClient: MongoClient, C: Constants) {
		super(dbClient, C.db.name)
	}

	public getCollection(collectionName: string) {
		if (!this.customCollections.has(collectionName)) {
			this.customCollections.set(collectionName, new CustomCollection(this, collectionName))
		}
		return this.customCollections.get(collectionName) as CustomCollection
	}
}
