import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/connection";
import { validateToken } from "../utils/tokenHandler";

export async function isAuth(req: Request, res: Response, next: NextFunction) {

    const { token } = req.headers
    if (!token) return res.status(500).send({ message: 'Token not provided' })

    const data = String(token)
    const realToken = data.replace(/^Bearer\s/, "");

    const { decoded, valid } = await validateToken(realToken)

    if (!valid) return res.status(500).send({ message: 'Invalid token 1' })

    const { userId, hash }: any = decoded

    if (!(userId && hash)) {
        return res.status(500).send({ message: 'Failed to validate token' })
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) return res.status(500).send({ message: 'Failed to validate token' })

    const userHash = user.password.substring(0, 10)
    if (hash !== userHash) return res.status(500).send({ message: 'Invalid token' })

    req.user = user

    return next()

}