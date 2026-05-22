import { PrismaClient } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import express, { type Router, type Request, type Response, type NextFunction } from "express"
import bcrypt from "bcrypt"
import crypto from "crypto"
import fs from 'fs/promises'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import auth from "../middleware/auth"

const router: Router = express.Router()
const prisma = new PrismaClient()

interface PasswordResetToken {
    token: string
    userId: number
    expiresAt: Date
}

const passwordResetTokens: PasswordResetToken[] = []
const resetTokenTtlMs = 1000 * 60 * 30

const smtpHost = (process.env.SMTP_HOST || 'smtp.gmail.com').trim()
const smtpPort = Number(process.env.SMTP_PORT || 465)
const smtpUser = process.env.SMTP_USER
const smtpPass = process.env.SMTP_PASS
const smtpFrom = process.env.SMTP_FROM || smtpUser

const mailTransport = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined
})

function cleanupExpiredResetTokens() {
    const now = Date.now()
    for (let i = passwordResetTokens.length - 1; i >= 0; i -= 1) {
        if (passwordResetTokens[i].expiresAt.getTime() <= now) {
            passwordResetTokens.splice(i, 1)
        }
    }
}

function createResetToken(userId: number) {
    cleanupExpiredResetTokens()
    const token = crypto.randomBytes(32).toString('hex')
    passwordResetTokens.push({
        token,
        userId,
        expiresAt: new Date(Date.now() + resetTokenTtlMs)
    })
    return token
}

function consumeResetToken(token: string) {
    cleanupExpiredResetTokens()
    const tokenIndex = passwordResetTokens.findIndex((entry) => entry.token === token)
    if (tokenIndex === -1) {
        return null
    }
    const entry = passwordResetTokens[tokenIndex]
    passwordResetTokens.splice(tokenIndex, 1)
    return entry
}

interface UserParams {
    id: string
}

interface UserQuizLikeParams {
    quizId: string
    userId: string
}

interface UserCreate {
    name: string
    email: string
    password: string
    path_to_img?: string
}

interface UserUpdate {
    name: string
    email: string
}

interface SavedQuizData {
    quiz: {
        id: number
        name: string
        description: string | null
        authorId: number
    }
    id: number
    userId: number
    quizId: number
    folderId: number | null
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.query.userId ? parseInt(req.query.userId as string): undefined
        if (!userId)
        {
            return res.sendStatus(400)
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                path_to_img: true
            },
        })

        if (user) {
            let imageBase64 = null

            if (user.path_to_img) {
                const imageBuffer = await fs.readFile(user.path_to_img)
                imageBase64 = imageBuffer.toString('base64')
            }

            return res.json({
                name: user.name,
                image: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : null
            })
        }
        else {
            return res.sendStatus(404)
        }
    }
    catch(error) {
        next(error)
    }
})

router.get("/:id(\\d+)", async (req: Request<UserParams>, res: Response, next: NextFunction) => {
    try {
        const userId: number = parseInt(req.params.id)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                path_to_img: true
            },
        })

        if (user) {
            return res.json(user)
        }
        else {
            return res.sendStatus(404)
        }
    }
    catch(error) {
        next(error)
    }
})

router.get("/:id(\\d+)/created-quizzes", async (req: Request<UserParams>, res: Response, next: NextFunction) => {
    try {
        const userId: number = parseInt(req.params.id)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                createdQuizzes: true
            },
        })

        if (user) {
            return res.json(user.createdQuizzes)
        }
        else {
            return res.sendStatus(404)
        }
    }
    catch(error) {
        next(error)
    }
})

router.get("/:id(\\d+)/saved-quizzes", async (req: Request<UserParams>, res: Response, next: NextFunction) => {
    try {
        const userId: number = parseInt(req.params.id)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                SavedQuiz: {
                    include: {
                        quiz: true,
                    }
                }
            },
        })

        if (user) {
            return res.json(user.SavedQuiz.map((savedQuiz: SavedQuizData) => savedQuiz.quiz))
        }
        else {
            return res.sendStatus(404)
        }
    }
    catch(error) {
        next(error)
    }
})

router.get("/:id(\\d+)/folders", async (req: Request<UserParams>, res: Response, next: NextFunction) => {
    try {
        const userId: number = parseInt(req.params.id)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                Folder: {
                    include: {
                        SavedQuiz: true,
                    }
                }
            },
        })

        if (user) {
            return res.json(user.Folder)
        }
        else {
            return res.sendStatus(404)
        }
    }
    catch(error) {
        next(error)
    }
})

router.get("/:userId(\\d+)/quizzes/:quizId(\\d+)", async (req: Request<UserQuizLikeParams>, res: Response, next: NextFunction) => {
    try {
        const quizId = parseInt(req.params.quizId)
        const userId = parseInt(req.params.userId)
        const quizLike = await prisma.userQuizLike.findUnique({
            where: {
                userId_quizId: {
                    userId: userId,
                    quizId: quizId,
                }
            }
        })

        if (quizLike) {
            return res.json(quizLike)
        }
        else {
            return res.sendStatus(404)
        }
    }
    catch (error) {
        next(error)
    }
})

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, ...rest } = req.body

        if (!password) {
            return res.status(400).json({
                error: "Hasło jest wymagane"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUserData: UserCreate = {
            ...rest,
            password: hashedPassword
        }

        const createdUser = await prisma.user.create({
            data: newUserData,
            select: {
                id: true,
                name: true,
                email: true,
                path_to_img: true,
            },
        })

        return res.status(201).json({createdUser})
    }
    catch(error) {
        if (
            error instanceof PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            const field = (error.meta?.target as string[] | undefined)?.[0]

            if (field === "name") {
                return res.status(409).json({
                    error: "Podana nazwa użytkownika jest zajęta"
                })
            }
            else if (field === "email") {
                return res.status(409).json({
                    error: "Istnieje już konto z podanym adresem email"
                })
            }
            else {
                return next(error)
            }
        }
        else {
            return next(error)
        }
    }
})

router.post("/password/forgot", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = String(req.body.email || '').trim()
        if (!email) {
            return res.status(400).json({ error: "Email jest wymagany" })
        }

        if (!smtpUser || !smtpPass || !smtpFrom) {
            return res.status(500).json({ error: "Brak konfiguracji SMTP" })
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, name: true }
        })

        if (user) {
            const token = createResetToken(user.id)
            const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').trim()
            const resetUrl = `${frontendUrl}/reset-password?token=${token}`

            await mailTransport.sendMail({
                from: smtpFrom,
                to: user.email,
                subject: "Password reset",
                text: `Open this link to reset your password: ${resetUrl}`
            })
        }

        return res.status(200).json({ message: "Jeśli konto istnieje, wyslano email z linkiem" })
    }
    catch (error) {
        next(error)
    }
})

router.post("/password/reset", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = String(req.body.token || '').trim()
        const password = String(req.body.password || '').trim()

        if (!token || !password) {
            return res.status(400).json({ error: "Token i haslo sa wymagane" })
        }

        const tokenEntry = consumeResetToken(token)
        if (!tokenEntry) {
            return res.status(400).json({ error: "Token jest niepoprawny lub wygasl" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await prisma.user.update({
            where: { id: tokenEntry.userId },
            data: { password: hashedPassword }
        })

        return res.status(200).json({ message: "Haslo zostalo zmienione" })
    }
    catch (error) {
        next(error)
    }
})

router.patch("/:id(\\d+)/password", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id)
        const currentPassword = String(req.body.currentPassword || '')
        const newPassword = String(req.body.newPassword || '').trim()

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Hasla sa wymagane" })
        }

        const authUser = (req as Request & { user?: string | jwt.JwtPayload }).user
        const authUserId = typeof authUser === 'object' && authUser && 'id' in authUser ? Number(authUser.id) : null

        if (!authUserId || authUserId !== userId) {
            return res.status(403).json({ error: "Brak dostepu" })
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { password: true }
        })

        if (!user) {
            return res.sendStatus(404)
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            return res.status(400).json({ error: "Niepoprawne aktualne haslo" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        })

        return res.status(200).json({ message: "Haslo zostalo zmienione" })
    }
    catch (error) {
        next(error)
    }
})

router.patch("/:id(\\d+)", async (req: Request<UserParams>, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id)
        const payload: UserUpdate = req.body

        if (!payload.name && !payload.email) {
            return res.status(400).json({
                error: "Brak danych do aktualizacji"
            })
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                name: payload.name,
                email: payload.email
            },
            select: {
                id: true,
                name: true,
                email: true,
                path_to_img: true
            }
        })

        return res.json(updatedUser)
    }
    catch(error) {
        if (
            error instanceof PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            const field = (error.meta?.target as string[] | undefined)?.[0]

            if (field === "name") {
                return res.status(409).json({
                    error: "Podana nazwa użytkownika jest zajęta"
                })
            }
            else if (field === "email") {
                return res.status(409).json({
                    error: "Istnieje już konto z podanym adresem email"
                })
            }
        }

        return next(error)
    }
})

router.delete("/:id(\\d+)", async (req: Request<UserParams>, res: Response, next: NextFunction) => {
    try {
        await prisma.user.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })

        return res.sendStatus(200)
    }
    catch(error) {
        next(error)
    }
})

export default router