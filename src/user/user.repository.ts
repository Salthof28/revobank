import { mockUsers } from "./data/mock-user";
import { User } from "./entities/user.entity";
import { Create, GetAll, GetOne, Updated, UserRepositoryItf } from "./user.repository.interface";
import { UserNotFoundException } from "./exceptions/user-not-found.exception";
import { HttpStatus, InternalServerErrorException } from "@nestjs/common";
import { scrypt as _scrypt, randomBytes } from "crypto"; // change name function callback to _scrypt
import { promisify } from "util";
import { LoginUserDto } from "src/auth/dto/login-user.dto";

// because function callback, we use promisify to be able use in async await function. scrypt change password to string
const scrypt = promisify(_scrypt);
export class UserRepository implements UserRepositoryItf {
    getAll(query: GetAll) {
        const allUsers: User[] = query.name ? mockUsers.filter(user => user.name.toLowerCase().includes(query.name.toLowerCase())) : mockUsers;
        return allUsers;
    }

    getOne(param: GetOne): User {
        const user: User | undefined = mockUsers.find(user => user.id === param.id);
        if(!user) throw new UserNotFoundException();
        return user;
    }

    updated(paramBody: Updated): User {
        const indexUser = mockUsers.findIndex(user => user.id === paramBody.id);
        if(indexUser === -1) throw new UserNotFoundException();
        let updatedUser = mockUsers[indexUser];
        updatedUser = {...updatedUser, ...paramBody.body};
        mockUsers[indexUser] = updatedUser;
        return updatedUser;
    }

    async created(bodyData: Create): Promise<User> {
        const findEmail: boolean = mockUsers.some(user => user.email === bodyData.body.email);
        console.log(findEmail);
        if(findEmail) throw new InternalServerErrorException({
            message: 'email already registered',
            error: 'false',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
        
        const salt = randomBytes(8).toString('hex');
        // use buffer because we use typescript and hash return buffer
        const hash = (await scrypt(bodyData.body.password, salt, 64)) as Buffer;
        // seperate salt and hash with dot (default format);
        bodyData.body.password = salt + '.' + hash.toString('hex');
        const newUser = bodyData.body;
        mockUsers.push(newUser);
        return newUser;
    }

    getProfile(request: number): User {
        const user: User | undefined = mockUsers.find(user => user.id === request);
        if(!user) throw new UserNotFoundException();
        return user;
    }
}