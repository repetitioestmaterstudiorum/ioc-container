import { describe, expect, it } from 'vitest'
import { C } from '/src/constants'

describe('constants tests', () => {
	it('C.app.port is defined', () => {
		expect(C.app.port).toBeDefined()
	})
})
