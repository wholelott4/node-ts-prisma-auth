import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import { prisma } from "../database/connection";
import { userRegisterSchema, userLoginSchema } from "../utils/validations/user.validation";
import { generateToken } from "../utils/tokenHandler";

type UserRegister = {
    email: string,
    password: string,
    name: string,
}

type UserLogin = {
    email: string,
    password: string,
}

export async function createUser(req: Request, res: Response) {
    try {

        console.log(req.body)

        const { error, value } = userRegisterSchema.validate(req.body)

        if (error) {
            return res.status(500).send({ message: 'Invalid fields value' })
        }

        const userData: UserRegister = value

        const exists = await prisma.user.findUnique({
            where: {
                email: String(userData.email).toLowerCase()
            }
        })

        if (exists) return res.status(500).send({ message: 'Email already in use' })

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(userData.password, salt)

        const user = await prisma.user.create({
            data: {
                email: String(userData.email).toLowerCase(),
                name: userData.name,
                password: hashedPass
            }
        })

        if (!user) return res.status(500).send({ message: 'Not possible to create user' })

        const token = generateToken(false, user.password.substring(0, 10), user.id)
        const refreshToken = generateToken(true, user.password.substring(0, 10), user.id)

        return res.status(200).send({ user, token, refreshToken })

    } catch (err) {
        return res.status(500).send({ message: 'Not possible to create user' })
    }
}

export async function loginUser(req: Request, res: Response) {
    try {

        const { error, value } = userLoginSchema.validate(req.body)

        if (error) {
            return res.status(500).send({ message: 'Invalid fields value' })
        }

        const userData: UserLogin = value

        const user = await prisma.user.findUnique({
            where: {
                email: String(userData.email).toLowerCase()
            }
        })

        if (!user) return res.status(500).send({ message: 'Invalid login details' })

        const hashedPass = user.password;
        const isValid = await bcrypt.compare(userData.password, hashedPass)
        if (!isValid) {
            return res.status(500).send({ message: 'Invalid login details' })
        }

        const token = generateToken(false, user.password.substring(0, 10), user.id)
        const refreshToken = generateToken(true, user.password.substring(0, 10), user.id)

        return res.status(200).send({ user, token, refreshToken })

    } catch (err) {
        return res.status(500).send({ message: 'Not possible to create user' })
    }
}