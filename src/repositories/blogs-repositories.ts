import {dataBlogs} from "../data";

export const blogsRepositories = {
    findBlogs() {
        return dataBlogs
    },

    findBlog(id: string | null | undefined) {
        const blog = dataBlogs.find(el => el['id'] === id);

        if (blog) {
            return blog;
        } else {
            return undefined;
        }
    },

    createBlog(name:string, youtubeUrl:string) {
        const id = new Date()

        const newBlog = {
            "id": id.toISOString(),
            "name": name,
            "youtubeUrl":youtubeUrl
        }

        dataBlogs.push(newBlog)

        return newBlog;
    },

    updateBlog(id: string, newName: string, newUrl: string) {
        for (let i = 0; i < dataBlogs.length -1; i++) {
            if(dataBlogs[i].id === id) {
                dataBlogs[i].name = newName;
                dataBlogs[i].youtubeUrl = newUrl;

                return true;
            }
        }

        return false;
    },

    deleteBlog(id: string) {
        let isDeleteBlog = false;

        for (let i = 0; i < dataBlogs.length - 1; i++) {
            if (dataBlogs[i].id === id) {
                isDeleteBlog = true;
                dataBlogs.splice(i, 1);
                return isDeleteBlog;
            }
        }

        return isDeleteBlog;
    }
}