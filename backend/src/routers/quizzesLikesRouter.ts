import { PrismaClient } from "@prisma/client"
import express, { type Router, type Request, type Response, type NextFunction } from "express"


const router: Router = express.Router()
const prisma = new PrismaClient()

interface QuizLikeParams {
    id: string
}

interface QuizLikeUserQuizParams {
    userId: string
    quizId: string
}

interface QuizLikeQuizParams {
    quizId: string
}

interface QuizLikeCreateAndUpdate {
    isLiked: boolean
    userId: number
    quizId: number
}

interface QuizLikeUpdatePayload {
    isLiked: boolean
}

router.get("/quiz/:quizId(\\d+)/counts", async (req: Request<QuizLikeQuizParams>, res: Response, next: NextFunction) => {
    try {
        const quizId = parseInt(req.params.quizId)

        if (Number.isNaN(quizId)) {
            return res.sendStatus(400)
        }

        const [likes, dislikes] = await Promise.all([
            prisma.userQuizLike.count({
                where: {
                    quizId,
                    isLiked: true,
                }
            }),
            prisma.userQuizLike.count({
                where: {
                    quizId,
                    isLiked: false,
                }
            })
        ])

        return res.json({ likes, dislikes })
    }
    catch (error) {
        next(error)
    }
})

router.get("/user/:userId(\\d+)/quiz/:quizId(\\d+)", async (req: Request<QuizLikeUserQuizParams>, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.userId)
        const quizId = parseInt(req.params.quizId)

        if (Number.isNaN(userId) || Number.isNaN(quizId)) {
            return res.sendStatus(400)
        }

        const quizLike = await prisma.userQuizLike.findUnique({
            where: {
                userId_quizId: {
                    userId,
                    quizId,
                }
            }
        })

        if (!quizLike) {
            return res.sendStatus(404)
        }

        return res.json(quizLike)
    }
    catch (error) {
        next(error)
    }
})

router.get("/:id(\\d+)", async (req: Request<QuizLikeParams>, res: Response, next: NextFunction) => {
    try {
        const quizLikeId: number = parseInt(req.params.id)
        const quizLike = await prisma.userQuizLike.findUnique({
            where: {
                id: quizLikeId
            }
        })

        if (quizLike) {
            return res.json(quizLike)
        }
        else{
            return res.sendStatus(404)
        }
    }
    catch (error) {
        next(error)
    }
})

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createdQuizLike = await prisma.userQuizLike.create({
            data: req.body as QuizLikeCreateAndUpdate,
        })

        return res.status(201).json(createdQuizLike)
    }
    catch (error) {
        next(error)
    }
})

router.put("/user/:userId(\\d+)/quiz/:quizId(\\d+)", async (req: Request<QuizLikeUserQuizParams>, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.userId)
        const quizId = parseInt(req.params.quizId)
        const payload = req.body as QuizLikeUpdatePayload

        if (Number.isNaN(userId) || Number.isNaN(quizId)) {
            return res.sendStatus(400)
        }

        const quizLike = await prisma.userQuizLike.upsert({
            where: {
                userId_quizId: {
                    userId,
                    quizId,
                }
            },
            update: {
                isLiked: payload.isLiked,
            },
            create: {
                userId,
                quizId,
                isLiked: payload.isLiked,
            }
        })

        return res.status(200).json(quizLike)
    }
    catch (error) {
        next(error)
    }
})

router.delete("/user/:userId(\\d+)/quiz/:quizId(\\d+)", async (req: Request<QuizLikeUserQuizParams>, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.userId)
        const quizId = parseInt(req.params.quizId)

        if (Number.isNaN(userId) || Number.isNaN(quizId)) {
            return res.sendStatus(400)
        }

        await prisma.userQuizLike.delete({
            where: {
                userId_quizId: {
                    userId,
                    quizId,
                }
            }
        })

        return res.sendStatus(200)
    }
    catch (error) {
        next(error)
    }
})

router.patch("/:id(\\d+)", async (req: Request<QuizLikeParams>, res: Response, next: NextFunction) => {
    try {
        const quizLikeId: number = parseInt(req.params.id)
        const updatedQuizLikeData = req.body as QuizLikeCreateAndUpdate

        const updatedQuizLike = await prisma.userQuizLike.update({
            where: {
                id: quizLikeId,
            },
            data: updatedQuizLikeData
        })

        return res.status(200).json(updatedQuizLike)
    }
    catch (error) {
        next(error)
    }
})

router.delete("/:id(\\d+)", async (req: Request<QuizLikeParams>, res: Response, next: NextFunction) => {
    try {
        await prisma.userQuizLike.delete({
            where: {
                id: parseInt(req.params.id),
            }
        })

        return res.sendStatus(200)
    }
    catch (error) {
        next(error)
    }
})

export default router