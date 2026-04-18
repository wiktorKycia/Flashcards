import { PrismaClient } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import express, { Router, Request, Response, NextFunction } from "express"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router: Router = express.Router()
const prisma = new PrismaClient()

interface UserCreate {
    name: string
    email: string
    password: string
}

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body

        if (!password) {
            return res.status(400).json({
                error: "Hasło jest wymagane"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUserData: UserCreate = {
            name,
            email,
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
    catch (error)
    {
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
