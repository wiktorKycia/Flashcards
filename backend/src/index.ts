import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import usersRouter from "./routers/usersRouter"
import foldersRouter from "./routers/foldersRouter"
import flashcardsRouter from "./routers/flashcardsRouter"
import quizzesRouter from "./routers/quizzesRouter"
import quizzesProgressRouter from "./routers/quizzesProgressRouter"
import savedQuizzesRouter from "./routers/savedQuizzesRouter"

const myenv = dotenv.config({ path: '.env.app' })
dotenvExpand.expand(myenv)

const app = express()

// const frontend_origin = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173').trim()

app.use(cors())
app.use(express.json())

app.use("/users", usersRouter)
app.use("/folders", foldersRouter)
app.use("/saved-quizzes", savedQuizzesRouter)
app.use("/flashcards", flashcardsRouter)
app.use("/quizzes", quizzesRouter)
app.use("/quizzes-progress", quizzesProgressRouter)

app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({content: "Hello world!"})
})

app.all("*", (_req: Request, res: Response) => {
    res.sendStatus(404)
})

app.listen(3000, () => {
    console.log('App is running on http://localhost:3000')
})
