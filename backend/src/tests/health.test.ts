import { afterAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../index'
import { testPrisma } from './helpers'

describe('GET /', () => {
    it('returns a health check payload', async () => {
        const response = await request(app).get('/')

        expect(response.status).toBe(200)
        expect(response.body).toEqual({ content: 'Hello world!' })
    })
})

describe('unknown routes', () => {
    it('returns 404 for unmatched paths', async () => {
        const response = await request(app).get('/this-route-does-not-exist')

        expect(response.status).toBe(404)
    })
})

afterAll(async () => {
    await testPrisma.$disconnect()
})
