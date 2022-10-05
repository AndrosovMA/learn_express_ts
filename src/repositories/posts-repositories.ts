import {dataBlogs, dataPosts} from "../data";

export const postsRepositories = {
    findPosts() {
        return dataPosts
    },

    findPost(id: string | null | undefined) {
        const post = dataPosts.find(el => el['id'] === id);

        if (post) {
            return post;
        } else {
            return undefined;
        }
    },

    createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const id = new Date()

        const blog = dataBlogs.find(el => el['id'] === blogId);
        if (!blog) return false;

        if (!blog.name) {
            return false
        } else {
            const newPost: Post = {
                "id": id.toISOString(),
                "title": title,
                "shortDescription": shortDescription,
                "content": content,
                "blogId": blogId,
                "blogName": blog.name
            }

            dataPosts.push(newPost)

            return newPost;
        }
    },

    updatePost(id: string, newtitle: string, newShortDescription: string, newContent: string, newBlogId: string) {
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

    deletePost(id: string) {
        let isDeleteBlog = false;

        for (let i = 0; i < dataPosts.length; i++) {
            if (dataPosts[i].id === id) {
                isDeleteBlog = true;
                dataPosts.splice(i, 1);
                return isDeleteBlog;
            }
        }

        return isDeleteBlog;
    },

    checkBlogId(blogId: string) {
        return dataBlogs.find(el => el.id === blogId)
    }
}


type Post = {
    "id": string,
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
    "blogName": string
}