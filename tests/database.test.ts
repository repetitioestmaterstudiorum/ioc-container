import { beforeAll, describe, expect, test } from 'vitest'
import { getTestUtils } from '/tests/tests.utils'
import { ModuleTypes } from '/src/Modules/Container'

// ---

let DbModule: ModuleTypes['Db']

beforeAll(async () => {
	const { Container } = await getTestUtils()

	DbModule = Container.get<ModuleTypes['Db']>('Db')
})

describe('DbClient Class', async () => {
	test('getCollection() returns the collection', async () => {
		const Coll = DbModule.getCollection('test')
		expect(Coll).toBeDefined()
	})
})

describe('CustomCollection Class', async () => {
	test('raw collections exist', async () => {
		const Coll = DbModule.getCollection('test')
		expect(Coll.raw.findOne).toBeDefined()
	})

	test('updateOne() updates doc', async () => {
		const Coll = DbModule.getCollection('test')
		const inserted = await Coll.raw.insertOne({ x: 'y' })
		await Coll.updateOne({ _id: inserted.insertedId }, { $set: { x: 'z' } })

		const doc = await Coll.raw.findOne({ _id: inserted.insertedId })
		expect(doc?.x).toBe('z')
	})

	test('updateOne() adds updatedAt', async () => {
		const Coll = DbModule.getCollection('test')
		const inserted = await Coll.raw.insertOne({ test: true })
		await Coll.updateOne({ _id: inserted?.insertedId }, { $set: { y: 0 } })

		const doc = await Coll.raw.findOne({ _id: inserted.insertedId })
		expect(doc?.updatedAt).toBeDefined()
	})

	test('updateMany() updates documents', async () => {
		const Coll = DbModule.getCollection('test')
		const inserted = await Coll.raw.insertMany([{ x: 'a' }, { x: 'b' }])
		await Coll.updateMany(
			{ _id: { $in: Object.values(inserted.insertedIds) } },
			{ $set: { x: 'updated' } }
		)

		await Coll.raw.find({ _id: { $in: Object.values(inserted.insertedIds) } }).forEach(doc => {
			expect(doc.x).toBe('updated')
		})
	})

	test('updateMany() adds updatedAt', async () => {
		const Coll = DbModule.getCollection('test')
		const inserted = await Coll.raw.insertMany([{ x: 'y' }, { y: 'z' }])
		await Coll.updateMany({ _id: Object.values(inserted.insertedIds) }, { $set: { y: 0 } })

		await Coll.raw.find({ _id: Object.values(inserted.insertedIds) }).forEach(doc => {
			expect(doc?.updatedAt).toBeDefined()
		})
	})

	test('insertOne() adds db fields updatedAt, etc.', async () => {
		const Coll = DbModule.getCollection('test')
		const inserted = await Coll.insertOne({ x: 'y' })

		const doc = await Coll.raw.findOne({ _id: inserted.insertedId })
		expect(doc?.updatedAt).toBeDefined()
		expect(doc?.createdAt).toBeDefined()
	})

	test('insertOne() adds _id as string', async () => {
		const Coll = DbModule.getCollection('test')
		const inserted = await Coll.insertOne({ x: 'y' })

		const doc = await Coll.raw.findOne({ _id: inserted.insertedId })
		expect(typeof doc?._id).toBe('string')
	})

	test('"complex" query on document inserted using insertOne()', async () => {
		const Coll = DbModule.getCollection('test')
		const inserted1 = await Coll.insertOne({ 1: '0', y: 1000 })
		const inserted2 = await Coll.insertOne({ 1: '0', y: 5 })

		const doc = await Coll.raw.findOne({
			_id: { $in: [inserted1.insertedId, inserted2.insertedId] },
			1: '0',
			y: { $gte: 500 },
		})
		expect(doc?.y).toBe(1000)
	})

	test('insertMany() adds db fields updatedAt, etc.', async () => {
		const Coll = DbModule.getCollection('test')
		const inserted = await Coll.insertMany([{ x: '0' }, { x: '1' }])

		await Coll.raw.find({ _id: { $in: Object.values(inserted.insertedIds) } }).forEach(doc => {
			expect(doc?.updatedAt).toBeDefined()
			expect(doc?.createdAt).toBeDefined()
		})
	})

	test('insertMany() adds _id as string', async () => {
		const Coll = DbModule.getCollection('test')
		const inserted = await Coll.insertMany([{ x: '0' }, { x: '1' }])

		await Coll.raw.find({ _id: { $in: Object.values(inserted.insertedIds) } }).forEach(doc => {
			expect(typeof doc?._id).toBe('string')
		})
	})
})
