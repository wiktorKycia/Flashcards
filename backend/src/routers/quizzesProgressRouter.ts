import { PrismaClient } from "@prisma/client"
import express, { type Router, type Request, type Response, type NextFunction } from "express"

const router: Router = express.Router()
const prisma = new PrismaClient()

interface QuizProgressParams {
    id: string
}

interface QuizProgressCreate {
    isKnown?: boolean
    userId: number
    quizId: number
    flashcardId: number
}

interface QuizProgressUpdate {
    isKnown: boolean
}

interface QuizProgressQuery {
    userId?: string
    quizId?: string
}

router.get("/user/:id(\\d+)/quiz/:id(\\d+)", async (req: Request<QuizProgressQuery>, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.userId as string)
        const quizId = parseInt(req.params.quizId as string)

        if (Number.isNaN(userId) || Number.isNaN(quizId)) {
            return res.sendStatus(400)
        }

        const quizProgress = await prisma.userQuizProgress.findMany({
            where: {
                userId,
                quizId,
            },
            select: {
                flashcardId: true,
                isKnown: true,
            },
        })

        return res.json(quizProgress)
    }
    catch (error) {
        next(error)
    }
})

router.get("/:id(\\d+)", async (req: Request<QuizProgressParams>, res: Response, next: NextFunction) => {
    try {
        const quizProgressId: number = parseInt(req.params.id)
        const quizProgress = await prisma.userQuizProgress.findUnique({
            where: {
                id: quizProgressId
            }
        })

        if (quizProgress) {
            return res.json(quizProgress)
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
        const createdQuizProgress = await prisma.userQuizProgress.create({
            data: req.body as QuizProgressCreate,
        })

        return res.status(201).json(createdQuizProgress)
    }
    catch (error) {
        next(error)
    }
})

router.patch("/:id(\\d+)", async (req: Request<QuizProgressParams>, res: Response, next: NextFunction) => {
    try {
        const quizProgressId: number = parseInt(req.params.id)
        const updatedQuizProgressData: QuizProgressUpdate = req.body as QuizProgressUpdate

        const updatedQuizProgress = await prisma.userQuizProgress.update({
            where: {
                id: quizProgressId,
            },
            data: {
                isKnown: updatedQuizProgressData.isKnown,
            },
        })

        return res.status(200).json(updatedQuizProgress)
    }
    catch (error) {
        next(error)
    }
})

router.delete("/:id(\\d+)", async (req: Request<QuizProgressParams>, res: Response, next: NextFunction) => {
    try {
        await prisma.userQuizProgress.delete({
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