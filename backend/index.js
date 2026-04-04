const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.status(200).json({content: "Hello world!"})
})

app.listen(3000, () => {
    console.log('App is running on http://localhost:3000')
})
