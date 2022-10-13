import {collectionBlogs} from "./db";



export const blogsRepositories = {
    async findBlogs(): Promise<Blog[]> {
        return await collectionBlogs.find({}).toArray()
    },

    async findBlog(id: string | null | undefined): Promise<Blog | null | undefined> {
        if (id) {
            return await collectionBlogs.findOne({id: id});
        } else {
            return undefined
        }
    },

    async createBlog(name: string, youtubeUrl: string): Promise<Blog> {
        const nowDate = new Date();

        const newBlog = {
            "id": nowDate.toISOString(),
            "name": name,
            "youtubeUrl": youtubeUrl,
            "createdAt": nowDate.toISOString()
        }

        await collectionBlogs.insertOne(newBlog)

        return newBlog;
    },

    async updateBlog(id: string, newName: string, newUrl: string): Promise<boolean> {

        const blogUpdate = await collectionBlogs.updateMany({id: id}, {
            $set: {name: newName, youtubeUrl: newUrl}
        })

        return blogUpdate.matchedCount !== 0;

    },

    async deleteBlog(id: string): Promise<boolean> {
       const blogDelete = await collectionBlogs.deleteOne({id: id})

       return blogDelete.deletedCount === 1;
    }
}

//Types
export type Blog = {
    "id": string,
    "name": string,
    "youtubeUrl": string,
    "createdAt": string
}
