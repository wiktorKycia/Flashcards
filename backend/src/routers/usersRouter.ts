import { PrismaClient } from "@prisma/client"
import express, { type Router, type Request, type Response, type NextFunction } from "express"
import bcrypt from "bcrypt"
import fs from 'fs/promises'
import type jwt from 'jsonwebtoken'
import auth from "../middleware/auth"

const router: Router = express.Router()
const prisma = new PrismaClient()


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
        return next(error)
    }
})

router.patch("/:id(\\d+)/password", auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id as string)
        const currentPassword = String(req.body.currentPassword || '')
        const newPassword = String(req.body.newPassword || '').trim()

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Hasła są wymagane" })
        }

        const authUser = (req as Request & { user?: string | jwt.JwtPayload }).user
        const authUserId = typeof authUser === 'object' && authUser && 'id' in authUser ? Number(authUser.id) : null

        if (!authUserId || authUserId !== userId) {
            return res.status(403).json({ error: "Brak dostępu" })
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
            return res.status(400).json({ error: "Niepoprawne aktualne hasło" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        })

        return res.status(200).json({ message: "Hasło zostało zmienione" })
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