import { afterAll, afterEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../index'
import { deleteTestUsers, testPrisma, uniqueTestUser } from './helpers'

describe('POST /api/auth/register', () => {
    it('creates a user when valid data is provided', async () => {
        const user = uniqueTestUser()

        const response = await request(app)
            .post('/api/auth/register')
            .send(user)

        expect(response.status).toBe(201)
        expect(response.body.createdUser).toMatchObject({
            name: user.name,
            email: user.email,
        })
        expect(response.body.createdUser).not.toHaveProperty('password')
    })

    it('returns 400 when password is missing', async () => {
        const user = uniqueTestUser()

        const response = await request(app)
            .post('/api/auth/register')
            .send({ name: user.name, email: user.email })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({ error: 'Hasło jest wymagane' })
    })
})

describe('POST /api/auth/login', () => {
    it('returns a token for valid credentials', async () => {
        const user = uniqueTestUser()

        await request(app).post('/api/auth/register').send(user)

        const response = await request(app)
            .post('/api/auth/login')
            .send({ login: user.email, password: user.password })

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
            token: expect.any(String),
            user: {
                name: user.name,
            },
        })
    })

    it('returns 400 for invalid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ login: 'nonexistent-user', password: 'wrong-password' })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({ message: 'Podany użytkownik nie istnieje' })
    })
})

describe('GET /api/users/:id', () => {
    it('returns the registered user', async () => {
        const user = uniqueTestUser()

        const registerResponse = await request(app)
            .post('/api/auth/register')
            .send(user)

        const createdUser = registerResponse.body.createdUser

        const response = await request(app).get(`/api/users/${createdUser.id}`)

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
            id: createdUser.id,
            name: user.name,
            email: user.email,
        })
    })

    it('returns 404 when the user does not exist', async () => {
        const response = await request(app).get('/api/users/999999999')

        expect(response.status).toBe(404)
    })
})

afterEach(async () => {
    await deleteTestUsers()
})

afterAll(async () => {
    await testPrisma.$disconnect()
})
