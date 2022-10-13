import {dataBlogs} from "../data";

export const blogsRepositories = {
    async findBlogs(): Promise<Blog[]> {
        return dataBlogs
    },

    async findBlog(id: string | null | undefined): Promise<Blog | undefined> {
        const blog = dataBlogs.find(el => el['id'] === id);

        if (blog) {
            return blog;
        } else {
            return undefined;
        }
    },

    async createBlog(name:string, youtubeUrl:string): Promise<Blog>  {
        const id = new Date()

        const newBlog = {
            "id": id.toISOString(),
            "name": name,
            "youtubeUrl":youtubeUrl
        }

        dataBlogs.push(newBlog)

        return newBlog;
    },

    async updateBlog(id: string, newName: string, newUrl: string): Promise<boolean> {
        for (let i = 0; i < dataBlogs.length; i++) {
            if(dataBlogs[i].id === id) {
                dataBlogs[i].name = newName;
                dataBlogs[i].youtubeUrl = newUrl;

                return true;
            }
        }

        return false;
    },

    async deleteBlog(id: string): Promise<boolean> {
        let isDeleteBlog = false;

        for (let i = 0; i < dataBlogs.length; i++) {
            if (dataBlogs[i].id === id) {
                isDeleteBlog = true;
                dataBlogs.splice(i, 1);
                return isDeleteBlog;
            }
        }

        return isDeleteBlog;
    }
}

//Types
export type Blog = {
    "id": string,
    "name": string,
    "youtubeUrl": string
}