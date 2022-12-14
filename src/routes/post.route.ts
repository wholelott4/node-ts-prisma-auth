import { Router } from "express";
import { createPost, deletePost, getAllPosts, getPost, updatePost } from "../controllers/post.controller";
import { isAuth } from "../middlewares/isAuth";
const router = Router()

router.post('/post', isAuth, createPost)
router.delete('/post/:id', isAuth, deletePost)
router.patch('/post/:id', isAuth, updatePost)
router.get('/post/:id', getPost)
router.get('/posts', getAllPosts)

export default router