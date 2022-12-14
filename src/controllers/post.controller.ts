import { Request, Response } from 'express'
import { prisma } from '../database/connection'
import { postCreateSchema, postUpdateSchema } from '../utils/validations/post.validation'

type PostCreate = {
    title: string,
    description: string,
    published?: boolean
}

export async function createPost(req: Request, res: Response) {
    try {

        const { error, value } = postCreateSchema.validate(req.body)

        if (error) {
            return res.status(500).send({ message: 'Invalid fields value' })
        }

        const postData: PostCreate = value

        const post = await prisma.post.create({
            data: { ...postData, authorId: req.user.id }
        })

        if (!post) return res.status(500).send({ message: 'Something went wrong' })

        return res.status(200).send({ post })

    } catch (err) {
        return res.status(500).send({ message: 'Not possible to create post' })
    }
}

export async function updatePost(req: Request, res: Response) {
    try {

        const { id } = req.params
        if (!id) return res.status(500).send({ message: 'ID is missing' })

        const { error, value } = postUpdateSchema.validate(req.body)

        if (error) {
            return res.status(500).send({ message: 'Invalid fields value' })
        }

        const postData: PostCreate = value

        const post = await prisma.post.findUnique({
            where: {
                id: Number(id)
            }
        })

        if (!post) return res.status(500).send({ message: 'Post not found' })
        if (post.authorId !== Number(req.user.id)) return res.status(500).send({ message: 'You can not update this post' })

        const updt = await prisma.post.update({
            where: {
                id: Number(id)
            },
            data: postData
        })

        if (!updt) return res.status(500).send({ message: 'Not possible to update post' })

        return res.status(200).send({ post: updt })

    } catch (err) {
        return res.status(500).send({ message: 'Not possible to update post' })
    }
}

export async function deletePost(req: Request, res: Response) {
    try {

        const { id } = req.params
        if (!id) return res.status(500).send({ message: 'ID is missing' })

        const post = await prisma.post.findUnique({
            where: {
                id: Number(id)
            }
        })

        if (!post) return res.status(500).send({ message: 'Post not found' })
        if (post.authorId !== Number(req.user.id)) return res.status(500).send({ message: 'You can not update this post' })

        const updt = await prisma.post.delete({
            where: {
                id: Number(id)
            },
        })

        if (!updt) return res.status(500).send({ message: 'Not possible to delete post' })

        return res.status(200).send({ message: 'Deleted' })

    } catch (err) {
        return res.status(500).send({ message: 'Not possible to delete post' })
    }
}

export async function getPost(req: Request, res: Response) {
    try {

        const { id } = req.params

        if (!id) return res.status(500).send({ message: 'ID is missing' })

        const post = await prisma.post.findUnique({
            where: {
                id: Number(id)
            },
        })

        if (!post) return res.status(500).send({ message: 'Post not found' })

        return res.status(200).send({ post })

    } catch (err) {
        return res.status(500).send({ message: 'Not possible to get post' })
    }
}

export async function getAllPosts(req: Request, res: Response) {
    try {

        const posts = await prisma.post.findMany({
            where: {
                published: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return res.status(200).send({ posts })

    } catch (err) {
        return res.status(500).send({ message: 'Not possible to posts' })
    }
}