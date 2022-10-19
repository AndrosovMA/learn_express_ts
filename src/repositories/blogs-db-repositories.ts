import {collectionBlogs} from "./db";


export const blogsRepositories = {
    async findBlogs(searchNameTerm: string, //решить вопрос с типизацией
                    pageNumber: number,
                    pageSize: number,
                    sortBy: string,
                    sortDirection: string): Promise<PagesBlogView> {

        const sortDirectionNumber = (sortDirection: string) => {
            if (sortDirection === "desc") return -1
            else {
                return 1
            }
        };
        const skipNumber = (pageNumber: number, pageSize: number) => {
            return (pageNumber - 1) * pageSize;
        }

        const blogs = await collectionBlogs
            .find({name: {$regex: searchNameTerm, $options: 'i'}}, {projection: {"_id": 0}})
            .sort({sortBy: sortDirectionNumber(sortDirection)})
            .skip(skipNumber(pageNumber, pageSize))
            .limit(pageSize)
            .toArray()

        return {
            "pagesCount": (Math.ceil(blogs.length / pageSize)),
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": blogs.length,
            "items": blogs.map(blog => ({
                "id": blog.id,
                "name": blog.name,
                "youtubeUrl": blog.youtubeUrl,
                "createdAt": blog.createdAt
            }))
        }},

    async findBlog(id: string | null | undefined): Promise<Blog | null | undefined> {
        if (id) {
            return await collectionBlogs.findOne({id: id}, {projection: {"_id": 0}});
        } else {
            return undefined
        }
    },

    async createBlog(name: string, youtubeUrl: string): Promise<Blog | null> {
        const nowDate = new Date();

        const newBlog = {
            "id": nowDate.toISOString(),
            "name": name,
            "youtubeUrl": youtubeUrl,
            "createdAt": nowDate.toISOString()
        };

        await collectionBlogs.insertOne(newBlog)

        return await collectionBlogs.findOne({id: newBlog.id}, {projection: {"_id": 0}});

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

export type PagesBlogView = {
    "pagesCount": number,  // всего страниц
    "page": number,        // текущая страница
    "pageSize": number,    // кол-во элементов на странице
    "totalCount": number,  // всего элементов
    "items": Blog[]
}
