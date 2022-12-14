import jwt from 'jsonwebtoken'

const jwtSecret: string = process.env.JWT_SECRET
const jwtRefresh: string = process.env.JWT_REFRESH

interface validateTokenReturn {
    valid: boolean,
    decoded: null | string | jwt.JwtPayload
}

export function generateToken(refresh: boolean, hash: string, userId: number) {

    return jwt.sign({ hash, userId }, (refresh ? jwtRefresh : jwtSecret), {
        algorithm: 'HS256',
        expiresIn: '1d'
    })

}

export async function validateToken(token: string): Promise<validateTokenReturn> {

    try {

        const decoded = jwt.verify(token, jwtSecret)
        return {
            valid: true,
            decoded
        }

    } catch (err) {
        console.log(err)
        return {
            valid: false,
            decoded: null
        }
    }

}