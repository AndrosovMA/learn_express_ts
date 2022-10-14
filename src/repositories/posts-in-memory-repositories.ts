import {dataBlogs, dataPosts} from "../data";
import {collectionBlogs, collectionPosts} from "./db";



export const postsRepositories = {
    async findPosts(): Promise<Post[]> {
        return await collectionPosts.find({}).toArray();
    },

    async findPost(id: string | null | undefined): Promise<Post | null | undefined> {

        if (id) {
            return await collectionPosts.findOne({id: id});
        } else {
            return undefined;
        }
    },

    async createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const nowDate = new Date()

        const blog = await collectionBlogs.findOne({id: blogId});

        if (!blog) return false;

        if (!blog.name) {
            return false
        } else {
            const newPost: Post = {
                "id": nowDate.toISOString(),
                "title": title,
                "shortDescription": shortDescription,
                "content": content,
                "blogId": blogId,
                "blogName": blog.name,
                "createdAt": nowDate.toISOString()
            }

            await collectionPosts.insertOne(newPost)

            return newPost;
        }
    },

    async updatePost(id: string, newtitle: string, newShortDescription: string, newContent: string, newBlogId: string) {
        for (let i = 0; i < dataPosts.length; i++) {
            if (dataPosts[i].id === id) {
                dataPosts[i].title = newtitle;
                dataPosts[i].shortDescription = newShortDescription;
                dataPosts[i].content = newContent;
                dataPosts[i].blogId = newBlogId;

                return true;
            }
        }

        return false;
    },

    async deletePost(id: string) {
        const deletedPost = await collectionPosts.deleteOne({id: id});
        return  deletedPost.deletedCount === 1;
    },

    async checkBlogId(blogId: string) {
        return dataBlogs.find(el => el.id === blogId)
    }
}


export type Post = {
    "id": string,
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
    "blogName": string,
    "createdAt": string
}