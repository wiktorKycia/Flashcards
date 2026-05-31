import { PrismaClient } from "@prisma/client"
import express, { type Router, type Request, type Response, type NextFunction } from "express"
import bcrypt from "bcrypt"
import multer from "multer";
import path from "path";
import fs from "fs";
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

interface UserQuizLike {
    id: number
    quizId: number
    userId: number
    isLiked: boolean
}

interface QuizData {
    quiz: {
        id: number
        name: string
        description: string | null
        authorId: number
        frontLanguage: string
        backLanguage: string
        UserQuizLike?: UserQuizLike[]
    }
    id: number
    userId: number
    quizId: number
}

interface SignedUser {
    id: number
    name: string
    email: string
}

// absolute filepath
const UPLOAD_DIR = "/uploads/avatars";

// Make sure the folder exists at startup
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),

    filename: (req, file, cb) => {
        const user = (req as any).user;
        const userId = user?.id || 'unknown';
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${userId}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB cap
    fileFilter: (_req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPEG, PNG, WEBP and GIF images are allowed."));
        }
    },
});


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
                UserQuizLike: {
                    include: {
                        quiz: true,
                    }
                }
            },
        })

        if (user) {
            return res.json(user.UserQuizLike.map((savedQuiz: QuizData) => savedQuiz.quiz))
        }
        else {
            return res.sendStatus(404)
        }
    }
    catch(error) {
        next(error)
    }
})

router.get("/:id(\\d+)/liked-quizzes", async (req: Request<UserParams>, res: Response, next: NextFunction) => {
    try {
        const userId: number = parseInt(req.params.id)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                UserQuizLike: {
                    include: {
                        quiz: {
                            include: {
                                UserQuizLike: true
                            }
                        }
                    }
                }
            }
        })

        if (user) {
            const result = user.UserQuizLike.map((likedQuiz: QuizData) => {
                if (likedQuiz.quiz.UserQuizLike) {
                    const likes: number = likedQuiz.quiz.UserQuizLike.filter(
                        (x: UserQuizLike) => x.isLiked
                    ).length
                    const dislikes: number = likedQuiz.quiz.UserQuizLike.filter(
                        (x: UserQuizLike) => !x.isLiked
                    ).length

                    return {
                        ...likedQuiz.quiz,
                        likes,
                        dislikes
                    }
                }
                else {
                    return likedQuiz.quiz
                }
            }).sort((a: any, b: any) => b.likes - a.likes)

            return res.json(result)
        } else {
            return res.sendStatus(404)
        }
    }
    catch(error) {
        next(error)
    }
})

router.get("/:userId(\\d+)/quiz/:quizId(\\d+)", async (req: Request<UserQuizLikeParams>, res: Response, next: NextFunction) => {
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

router.get("/:userId/avatar", async (req: Request, res: Response, next: NextFunction) => {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
        return res.status(400).json({error: "Invalid user id"})
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { path_to_img: true },
        });

        if (!user?.path_to_img) {
            return res.status(404).json({ error: 'No avatar set for this user.' })
        }

        const absolutePath = user.path_to_img;

        if (!fs.existsSync(absolutePath)) {
            return res.status(404).json({ error: "Avatar file not found on disk."})
        }

        // Derive Content-Type from file extension
        const ext = path.extname(absolutePath).toLowerCase();
        const mimeTypes: Record<string, string> = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".webp": "image/webp",
            ".gif": "image/gif",
        };
        const contentType = mimeTypes[ext] ?? "application/octet-stream";

        res.setHeader("Content-Type", contentType);

        fs.createReadStream(absolutePath).pipe(res);
    } catch (err) {
        next(err)
    }
});


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

router.post("/avatar", auth, upload.single("avatar"), async (req: Request & {user?: SignedUser}, res: Response, next: NextFunction) => {
    const userId = req.user!.id
    if (!req.file) {
        res.status(400).json({ error: "No file uploaded." });
        return;
    }

    const relativePath = `/uploads/avatars/${req.file.filename}`

    try {
        await prisma.user.update({
            where: { id: userId! },
            data: { path_to_img: relativePath },
        });

        res.json({ avatarUrl: `/api/users/${userId}/avatar/` });
    } catch (err) {
        next(err)
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