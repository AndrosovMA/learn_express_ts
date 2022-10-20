import {collectionBlogs, collectionPosts} from "./db";


export const postsRepositories = {
    async findPosts(pageNumber: number,
                    pageSize: number,
                    sortBy: string,
                    sortDirection: string): Promise<PagesPostsView> {

        const sortDirectionNumber = (sortDirection: string) => {
            if (sortDirection === "desc") return -1
            else {
                return 1
            }
        };
        const skipNumber = (pageNumber: number, pageSize: number) => {
            return (pageNumber - 1) * pageSize;
        }

        const allPostsCount = await collectionPosts.countDocuments()

        const posts = await collectionPosts
            .find({}, {projection: {"_id": 0}})
            .sort({sortBy: sortDirectionNumber(sortDirection)})
            .skip(skipNumber(pageNumber, pageSize))
            .limit(pageSize)
            .toArray()

        return {
            pagesCount: (Math.ceil(allPostsCount / pageSize)),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: allPostsCount,
            items: posts.map(post => ({
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt
            }))
        }},

    async findPost(id: string | null | undefined): Promise<Post | null | undefined> {

        if (id) {
            return await collectionPosts.findOne({id: id}, {projection: {_id: 0}});
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

            await collectionPosts.insertOne(newPost);

            return await collectionPosts.findOne({id: newPost.id}, {projection: {"_id": 0}});
        }
    },

    async updatePost(id: string, newtitle: string, newShortDescription: string, newContent: string, newBlogId: string) {
        const updatedPost = await collectionPosts.updateMany({id: id}, {
            $set: {
                title: newtitle, shortDescription: newShortDescription, content: newContent, blogId: newBlogId
            }
        })

        return updatedPost.matchedCount !== 0;
    },

    async deletePost(id: string) {
        const deletedPost = await collectionPosts.deleteOne({id: id});
        return deletedPost.deletedCount === 1;
    },

    async checkBlogId(blogId: string) {
        const checkBlog = await collectionBlogs.findOne({id: blogId})
        return !!checkBlog;
    },

    async findPostsByBlogId (blogId: string | null | undefined,
                            pageNumber: number,
                            pageSize: number,
                            sortBy: string,
                            sortDirection: string): Promise<PagesPostsView | null | undefined> {

        const sortDirectionNumber = (sortDirection: string) => {
            if (sortDirection === "desc") return -1
            else {
                return 1
            }
        };
        const skipNumber = (pageNumber: number, pageSize: number) => {
            return (pageNumber - 1) * pageSize;
        };

        if (blogId) {
            const postsByBlog = await collectionPosts
                .find({blogId: blogId}, {projection: {_id: 0}})
                .sort({sortBy: sortDirectionNumber(sortDirection)})
                .skip(skipNumber(pageNumber, pageSize))
                .limit(pageSize)
                .toArray()

            return {
                "pagesCount": (Math.ceil(postsByBlog.length / pageSize)),
                "page": pageNumber,
                "pageSize": pageSize,
                "totalCount": postsByBlog.length,
                "items": postsByBlog.map((post) => ({
                    "id": post.id,
                    "title": post.title,
                    "shortDescription": post.shortDescription,
                    "content": post.content,
                    "blogId": post.blogId,
                    "blogName": post.blogName,
                    "createdAt": post.createdAt
                }))
            }

        } else {
            return undefined;
        }
    },

    async deleteAllData() {
    await collectionPosts.deleteMany({})
}
}


//Types
export type Post = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

export type PagesPostsView = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: Post[]
}