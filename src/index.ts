import "dotenv/config"
import express from 'express'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import userRouter from './routes/user.route'
import postRouter from './routes/post.route'
app.use('/v1/user', userRouter)
app.use('/v1', postRouter)

app.listen(4001, () => console.log('Server running'))