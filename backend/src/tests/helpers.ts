import { PrismaClient } from '@prisma/client'

export const testPrisma = new PrismaClient()

const TEST_EMAIL_SUFFIX = '@api-test.local'

export function uniqueTestUser() {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    return {
        name: `test-user-${id}`,
        email: `test-user-${id}${TEST_EMAIL_SUFFIX}`,
        password: 'TestPassword123!',
    }
}

export async function deleteTestUsers() {
    await testPrisma.user.deleteMany({
        where: {
            email: {
                endsWith: TEST_EMAIL_SUFFIX,
            },
        },
    })
}
