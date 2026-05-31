import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

const myenv = dotenv.config({ path: '.env.app' })
dotenvExpand.expand(myenv)

if (!process.env.DATABASE_URL) {
    throw new Error(
        'DATABASE_URL is not set. Start the database with docker compose and ensure backend/.env.app exists.'
    )
}

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in backend/.env.app')
}
