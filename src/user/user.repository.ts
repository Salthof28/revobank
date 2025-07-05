import { users } from "./data/mock-user";
import { User } from "./entities/user.entity";


export class UserRepository {
    async findById(id: string): Promise<User | null> {
        return users.find((user) => user.id === id) || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        return users.find((user) => user.email === email) || null;
    }

    async getFirst(): Promise<User | null> {
        return users.length > 0 ? users[0] : null;
    }

    async create(user: User): Promise<User> {
        users.push(user);
        return user;
    }

    async update(id: string, updatedUser: User): Promise<User | null> {
        const index = users.findIndex((user) => user.id === id);
        if(index !== -1) {
            users[index] = updatedUser;
            return updatedUser;
        }
        return null;
    }
}