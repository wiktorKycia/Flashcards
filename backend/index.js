const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')

const myenv = dotenv.config({ path: '.env.app' })
dotenvExpand.expand(myenv)

const app = express()

// const frontend_origin = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173').trim()

app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json({content: "Hello world!"})
})

app.listen(3000, () => {
    console.log('App is running on http://localhost:3000')
})
