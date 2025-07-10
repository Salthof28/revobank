import { mockUsers } from "./data/mock-user";
import { User } from "./entities/user.entity";
import { Create, GetAll, GetOne, Updated, UserRepositoryItf } from "./user.repository.interface";
import { UserNotFoundException } from "./exceptions/user-not-found.exception";


export class UserRepository implements UserRepositoryItf {
    getAll(query: GetAll) {
        const allUsers: User[] = query.name ? mockUsers.filter(user => user.name.toLowerCase().includes(query.name.toLowerCase())) : mockUsers;
        return allUsers;
    }

    getOne(param: GetOne): User {
        const account: User | undefined = mockUsers.find(user => user.id === param.id);
        if(!account) throw new UserNotFoundException();
        return account;
    }

    updated(paramBody: Updated): User {
        const indexUser = mockUsers.findIndex(user => user.id === paramBody.id);
        if(indexUser === -1) throw new UserNotFoundException();
        let updatedUser = mockUsers[indexUser];
        updatedUser = {...updatedUser, ...paramBody.body};
        mockUsers[indexUser] = updatedUser;
        return updatedUser;
    }

    created(bodyData: Create): User {
        const newUser = bodyData.body;
        mockUsers.push(newUser);
        return newUser;
    }

}