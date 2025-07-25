import { LoginUserDto } from "src/auth/dto/login-user.dto";
import { UpdateUserDto } from "./dto/req/update-user.dto";
import { User } from "./entities/user.entity";


export interface UserServiceItf {
    getAllUsers(name?: string): Promise<User[]>;
    adminGetUser(id: number): Promise<User>;
    updateUserProfile(paramBody: UpdateUser): Promise<User>;
    getProfileUser(request: number): Promise<User>;
}
export interface UpdateUser {
    id: number,
    body: UpdateUserDto,
    oldPassword?: string,
}