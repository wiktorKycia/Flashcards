import express, { type NextFunction, type Request, type Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import usersRouter from "./routers/usersRouter"
import foldersRouter from "./routers/foldersRouter"
import flashcardsRouter from "./routers/flashcardsRouter"
import quizzesRouter from "./routers/quizzesRouter"
import quizzesProgressRouter from "./routers/quizzesProgressRouter"
import savedQuizzesRouter from "./routers/savedQuizzesRouter"
import tasksGenerationRouter from "./routers/tasksGenerationRouter"
import quizzesLikesRouter from "./routers/quizzesLikesRouter"
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library'
import authRouter from './routers/auth'
import { MongoClient, type Collection } from "mongodb"

const myenv = dotenv.config({ path: '.env.app' })
dotenvExpand.expand(myenv)

const app = express()

// const frontend_origin = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173').trim()

app.use(cors())
app.use(express.json())

const mongoURL: string | undefined = process.env.MONGODB_URL
let errorsCollection: Collection
let requestsCollection: Collection
let connectedMongo: boolean = false

// Creating connection with MongoDB
void (async () => {
    if (!mongoURL) {
        console.warn(`MongoDB URL is missing`)
        return
    }

    try {
        const mongoClient = new MongoClient(mongoURL)
        await mongoClient.connect();
        const mongoDb = mongoClient.db("flashcards-app")
        errorsCollection = mongoDb.collection("errorLogs")
        requestsCollection = mongoDb.collection("requestLogs")
        console.log("Connected to flashcards-app in MongoDB")
        connectedMongo = true
    }
    catch (error) {
        console.error("Could not connect to flashcards-app in MongoDB: ", error)
    }
})()

app.use(async (req: Request, _res: Response, next: NextFunction) => {
    try {
        if (connectedMongo) {
            const log = {
                timestamp: new Date(),
                method: req.method,
                url: req.url,
                query: req.query,
                body: req.body
            }

            await requestsCollection.insertOne(log)
        }

        next()
    }
    catch (error) {
        next(error)
    }
})

app.use((req: Request, _res: Response, next: NextFunction) => {
    const now = new Date()
    let logMessage: string = `Request at ${now.toLocaleDateString()} ${now.toLocaleTimeString()} - ${req.method} ${req.url}`

    if (Object.keys(req.query).length > 0 && Object.keys(req.body).length > 0) {
        logMessage += ` with a query: ${JSON.stringify(req.query)} and a body ${JSON.stringify(req.body)}`
    }
    else if (Object.keys(req.query).length > 0) {
        logMessage += ` with a query: ${JSON.stringify(req.query)}`
    }
    else if (Object.keys(req.body).length > 0) {
        logMessage += ` with a body: ${JSON.stringify(req.body)}`
    }

    console.log(logMessage)
    next()
})

app.use('/api/auth', authRouter)
app.use("/api/users", usersRouter)
app.use("/api/folders", foldersRouter)
app.use("/api/saved-quizzes", savedQuizzesRouter)
app.use("/api/flashcards", flashcardsRouter)
app.use("/api/quizzes", quizzesRouter)
app.use("/api/quizzes-progress", quizzesProgressRouter)
app.use("/api/quizzes-likes", quizzesLikesRouter)
app.use("/api/tasks/generation", tasksGenerationRouter)

app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({content: "Hello world!"})
})

app.all("*", (_req: Request, res: Response) => {
    res.sendStatus(404)
})

app.use(async (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const errorMessage: string = err instanceof Error ? err.message : "Unknown error"
    const errorCode: string = typeof err === "object" && err !== null && "code" in err ? String(err.code) : "Unknown code"

    if (connectedMongo) {
        try {
            await errorsCollection.insertOne({
                timestamp: new Date(),
                code: errorCode,
                message: errorMessage
            })
        }
        catch (error2 : unknown) {
            const mongoErrorMessage: string = error2 instanceof Error ? error2.message : "Unknown error"
            const mongoErrorCode: string = typeof error2 === "object" && error2 !== null && "code" in error2 ? String(error2.code) : "Unknown code"
            console.error(`MongoDB error: ${mongoErrorCode} - ${mongoErrorMessage}`)
        }
    }

    console.error(`App error: ${errorCode} - ${errorMessage}`)

    if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025"){
            return res.sendStatus(404)
        }
        else if (err.code === "P2002"){
            const rawTarget = err.meta?.target as unknown
            // Prisma's `P2002` meta.target is not always an array; it can be a string (e.g. "User.name").
            const field = Array.isArray(rawTarget)
                ? rawTarget[0]
                : typeof rawTarget === "string"
                    ? rawTarget
                    : undefined
            const normalizedField = typeof field === "string" ? field.toLowerCase() : undefined
            // Prisma constraint names can look like: "User_email_key" / "User_name_key"
            // so we detect via `includes` instead of `endsWith`.
            const uniqueField =
                normalizedField?.includes("email") ? "email" :
                    normalizedField?.includes("name") ? "name" :
                        undefined

            const message: string =
                uniqueField === "name"
                    ? "Podana nazwa użytkownika jest zajęta"
                    : uniqueField === "email"
                        ? "Istnieje już konto z podanym adresem email"
                        : "Wartość musi być unikalna"
            return res.status(409).json({
                error: message
            })
        }
    }

    if (err instanceof PrismaClientValidationError) {
        return res.sendStatus(400)
    }

    // This section allows more accurate statuses and error logs to be recorded in the terminal and database in English, while sending messages to the frontend in Polish
    if (errorMessage === "Missing GITHUB_TOKEN in .env.app file") {
        return res.status(500).json({
            error: "Nie skonfigurowano tokena GitHub wymaganego do korzystania z modeli AI"
        })
    }
    else if (errorMessage === "All models failed or returned empty responses") {
        return res.status(503).json({
            error: "Wszystkie modele AI są chwilowo niedostępne lub osiągnęły limity. Spróbuj ponownie za około minutę"
        })
    }
    else if (errorMessage === "Flashcards not found") {
        return res.status(404).json({
            error: "Nie ma jakichkolwiek fiszek"
        })
    }

    else if (errorMessage === "Not enough flashcards found") {
        return res.status(422).json({
            error: "Nie znaleziono wystarczającej liczby fiszek do wygenerowania zadania"
        })
    }

    return res.sendStatus(500)
})

app.listen(3000, () => {
    console.log('App is running on http://localhost:3000')
})
