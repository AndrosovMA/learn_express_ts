import {v4} from "uuid";
import {UserDbType, usersRepositories, UserView} from "../repositories/users-db-repositories";
import bcrypt from "bcrypt"

export const usersService = {
    async createUser(login: string, password: string, email: string): Promise<UserView | null> {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(password, passwordSalt);

        const newUser: UserDbType = {
            id: v4(),
            login,
            email,
            passwordHash,
            createdAt: new Date().toISOString()
        };

        return await usersRepositories.createUser(newUser)
    },

    async _generateHash(password: string, passwordSalt: string) {
        const hash = await bcrypt.hash(password, passwordSalt);
        return hash
    },

    async checkCredentials(login: string, password: string) {

        const passwordHashUser = await usersRepositories.findHashUserByLogin(login);

        if (passwordHashUser) {
            const match = await bcrypt.compare(password, passwordHashUser);
            console.log(match);
            return match;
        } else {
            return false
        }
    }
}