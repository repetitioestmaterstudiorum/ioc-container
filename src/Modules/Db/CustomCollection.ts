import { ObjectId } from 'mongodb'
import type {
	BulkWriteOptions,
	Db,
	Document,
	Filter,
	InsertManyResult,
	InsertOneOptions,
	InsertOneResult,
	UpdateFilter,
	UpdateOptions,
	UpdateResult,
} from 'mongodb'

// ---

// custom collection methods
export class CustomCollection {
	// make all native mongo collection methods available on raw.<method>
	public readonly raw

	constructor(db: Db, collectionName: string) {
		this.raw = db.collection(collectionName)
	}

	/* Custom versions of commonly used mutating methods that automatically add default db fields: updatedAt, createdAt, _id (as string).
	These custom methods are in large parts copies of their originals in node_modules/mongodb/mongodb.d.ts with minor adjustments and/or simplifications (e.g. none of the custom methods have a callback option) */

	/**
	 * CUSTOM update a single document in a collection
	 * @param filter - The filter used to select the document to update
	 * @param update - The update operations to be applied to the document
	 * @param options - Optional settings for the command
	 */
	updateOne(
		filter: Filter<Document>,
		update: UpdateFilter<Document> | Partial<Document>,
		options?: UpdateOptions
	): Promise<UpdateResult> {
		update = {
			...update,
			$set: {
				...update['$set'],
				updatedAt: new Date(),
			},
		}
		return this.raw.updateOne(filter, update, options || {})
	}

	/**
	 * CUSTOM update multiple documents in a collection
	 * @param filter - The filter used to select the documents to update
	 * @param update - The update operations to be applied to the documents
	 * @param options - Optional settings for the command
	 */
	updateMany(
		filter: Filter<Document>,
		update: UpdateFilter<Document>,
		options?: UpdateOptions
	): Promise<UpdateResult | Document> {
		update = {
			...update,
			$set: {
				...update['$set'],
				updatedAt: new Date(),
			},
		}
		return this.raw.updateMany(filter, update, options || {})
	}

	/**
	 * CUSTOM inserts a single document into MongoDB
	 * @param doc - The document to insert
	 * @param options - Optional settings for the command
	 */
	insertOne(doc: Document, options?: InsertOneOptions): Promise<InsertOneResult<Document>> {
		const timestamp = new Date()
		doc = {
			...doc,
			_id: doc._id || new ObjectId().toString(),
			createdAt: timestamp,
			updatedAt: timestamp,
		}
		return this.raw.insertOne(doc, options || {})
	}

	/**
	 * CUSTOM inserts an array of documents into MongoDB
	 * @param docs - The documents to insert
	 * @param options - Optional settings for the command
	 */
	insertMany(docs: Document[], options?: BulkWriteOptions): Promise<InsertManyResult<Document>> {
		const timestamp = new Date()
		docs = docs.map(doc => ({
			...doc,
			_id: doc._id || new ObjectId().toString(),
			createdAt: timestamp,
			updatedAt: timestamp,
		}))
		return this.raw.insertMany(docs, options || {})
	}
}
