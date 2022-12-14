declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_SECRET: string,
            JWT_REFRESH: string
        }
    }
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}

export { }