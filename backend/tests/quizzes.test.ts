import { afterAll, afterEach, describe, expect, it
} from 'vitest'
import request from 'supertest'
import { app } from '../src/index'
import { deleteTestUsers, testPrisma } from './helpers'

describe('GET /api/quizzes', () => {
  it('returns a list of quizzes', async () => {
    const response = await request(app).get('/api/quizzes')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })
})

describe('GET /api/quizzes/:id', () => {
  it('returns 404 when the quiz does not exist', async () => {
    const response = await request(app).get('/api/quizzes/999999999')

    expect(response.status).toBe(404)
  })
})

afterEach(async () => {
  await deleteTestUsers()
})

afterAll(async () => {
  await testPrisma.$disconnect()
})
