import {collectionUsers} from "./db";
import {queryParamsType} from "../routers/users";
import {Filter} from "mongodb";

export const usersRepositories = {

    async findUsers(queryParams: queryParamsType): Promise<UsersView> {

        const {searchLoginTerm,
            searchEmailTerm,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        } = queryParams;

        const sortDirectionNumber = (sortDirection: string) => {
            if (sortDirection === "desc") return -1
            else {
                return 1
            }
        };

        const skipNumber = (pageNumber: number, pageSize: number) => {
            return (pageNumber - 1) * pageSize;
        };

        const usersFilter: Filter<UserDbType> = {
            $or: [
                { login: {$regex: searchLoginTerm, $options: 'i'}},
                { email: {$regex: searchEmailTerm, $options: 'i'}}
            ]
        }

        const allUsersCount = await collectionUsers.countDocuments(usersFilter);

        const users = await collectionUsers
            .find(usersFilter, {projection: {"_id": 0}})
            .sort({[sortBy]: sortDirectionNumber(sortDirection)})
            .limit(pageSize)
            .skip(skipNumber(pageNumber, pageSize))
            .toArray()

        return {
            pagesCount: (Math.ceil(allUsersCount / pageSize)),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: allUsersCount,
            items: users.map(user => ({
                id: user.id,
                login: user.login,
                email: user.email,
                createdAt: user.createdAt
            }))
        }
    },

    async createUser(newUser: UserDbType): Promise<UserView | null> {
        await collectionUsers.insertOne(newUser);

        return await collectionUsers.findOne({id: newUser.id},
            {projection: {_id: 0, passwordHash: 0}});
    },

    async findHashUserByLogin(login: string): Promise<string | null> {
        const isFindedUser = await collectionUsers.findOne({login: login} );

        if (isFindedUser) {
            return isFindedUser.passwordHash
        } else {
            return null
        }
    },

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDbType | null> {
        const user = await collectionUsers.findOne(
            {$or: [ {login: loginOrEmail}, {email: loginOrEmail}]},
            {projection: {_id: 0}}
        );
        return user
    },

    async deleteUserById(id: string): Promise<boolean> {
        const userDelete = await collectionUsers.deleteOne({id: id});

        return userDelete.deletedCount === 1;
    },

    async deleteAllData() {
        await collectionUsers.deleteMany({})
    }
}


//types
export type UserView = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export type UsersView = {
    pagesCount: number,    // ?????????? ??????????????
    page: number,        // ?????????????? ????????????????
    pageSize: number,    // ??????-???? ?????????????????? ???? ???????????????? (?????????????? ?????????????????? ???? ????????????????)
    totalCount: number,  // ?????????? ?????????????????? (????????????)
    items: UserView[]
}

export type UserDbType = {
    id: string,
    login: string,
    email: string,
    passwordHash: string,
    createdAt: string
}