import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Db } from '/src/Modules/Db/Db'
import { C } from '/src/constants'
import { Container } from '/src/Modules/Container'

// ---

export async function getTestUtils() {
	// get uri from in-memory db server
	const memoryDbServer = new TestDbMemoryServer()
	const testC = { ...C }
	testC.db.uri = await memoryDbServer.initServer()
	testC.db.name = `test-db--${getDateAndTimeString()}`

	// initialize the container with the in-memory db
	const dbClient = new MongoClient(C.db.uri)
	Container.registerModule('Db', new Db(dbClient, C))

	return { memoryDbServer, testC, Container }
}

// in memory mongodb server class for testing
export class TestDbMemoryServer {
	private server: MongoMemoryServer | undefined
	private uri: string | undefined

	async initServer() {
		if (this.server) {
			const errMsg = `server running already`
			console.error(errMsg)
			throw new Error(errMsg)
		}

		this.server = await MongoMemoryServer.create()
		this.uri = this.server.getUri()

		console.info(`started InMemoryMongoServer with URI ${this.uri}`)
		return this.uri
	}

	async stopServer() {
		if (!this.server) {
			const errMsg = `stopServer() called before initServer()`
			console.error(errMsg)
			throw new Error(errMsg)
		}

		console.info(`stopping InMemoryMongoServer with URI ${this.uri}`)
		this.server.stop()
	}
}

// helpers
function getDateAndTimeString() {
	const timestamp = new Date()
	const date = timestamp.toISOString().split('T')[0]
	const time = timestamp.toISOString().split('T')[1].split('.')[0].replace(/:/g, '-')

	// e.g. 2022-06-28--19-33-27
	return `${date}--${time}`
}
