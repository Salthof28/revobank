import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateUser, UserServiceItf } from './user.service.interface';
import { User } from './entities/user.entity';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { scrypt as _scrypt, randomBytes } from "crypto"; // change name function callback to _scrypt
import { promisify } from 'util';
import { EmailRegisteredException } from 'src/auth/exceptions/email-registered-exception';
import { PhoneRegisteredException } from 'src/auth/exceptions/phone-registered-exception';
import { KtpRegisteredException } from 'src/auth/exceptions/ktp-registered-exception';
import { Condition } from 'src/global/entities/condition.entity';
import { OldPasswordException } from './exceptions/old-password-exception';
import { NotInputException } from 'src/global/exception/no-input-exception';


const scrypt = promisify(_scrypt);
@Injectable()
 
export class UserService implements UserServiceItf  {
    constructor(private userRepository: UserRepository) {}

    // getAllUsers(query: GetAllUsers): User[] {
    //     return this.userRepository.getAll(query);
    // }

    async getAllUsers(name: string): Promise<User[]> {
        const allUsers: User[] | undefined = await this.userRepository.getAll(name);
        if(!allUsers) throw new UserNotFoundException();
        return allUsers;
    }

    async adminGetUser(id: number): Promise<User> {
        const user: User | undefined = await this.userRepository.getOne(id);
        if(!user) throw new UserNotFoundException();
        return user;
    }

    async updateUserProfile(paramBody: UpdateUser): Promise<User> {
        let user: User | undefined = await this.userRepository.getOne(paramBody.id);
        if(!user) throw new UserNotFoundException();
        // use findFirst because can run one query for any condition
        const conditions: Condition[] = [];
        if(paramBody.body.email && paramBody.body.email !== user.email) {
            conditions.push({ email: paramBody.body.email });
        }
        if(paramBody.body.phone && paramBody.body.phone !== user.phone) {
            conditions.push({ phone: paramBody.body.phone });
        }
        if(paramBody.body.number_ktp && paramBody.body.number_ktp !== user.number_ktp) {
            conditions.push({ number_ktp: paramBody.body.number_ktp });
        }
        if (conditions.length > 0) {
            const existing: User | undefined = await this.userRepository.findExistingUser(conditions);
            if (existing) {
                if (existing.email === paramBody.body.email?.toLowerCase()) throw new EmailRegisteredException();
                if (existing.phone === paramBody.body.phone) throw new PhoneRegisteredException();
                if (existing.number_ktp === paramBody.body.number_ktp) throw new KtpRegisteredException();
            }
        }
        // check old paswword and hashing the password before update database
        if(paramBody.body.password?.trim() && paramBody.oldPassword?.trim()) {
            const [salt, storedHash] = user.password.split('.');
            const hash = (await scrypt(paramBody.oldPassword, salt, 64)) as Buffer;
            if(storedHash !== hash.toString('hex')) throw new OldPasswordException();
            const newSalt = randomBytes(8).toString('hex');
            const newHash = (await scrypt(paramBody.body.password, newSalt, 64)) as Buffer;
            paramBody.body.password = newSalt + '.' + newHash.toString('hex');
        }
        else if(paramBody.body.password?.trim() && !paramBody.oldPassword?.trim()) throw new NotInputException('old password no been input');
        else if(!paramBody.body.password?.trim() && paramBody.oldPassword?.trim()) throw new NotInputException('new password no been input');

        // update database
        user = {...user, ...paramBody.body};
        return this.userRepository.updated({
            id: paramBody.id,
            body: user
        })
    }

    async getProfileUser(request: number): Promise<User> {
        const userProfile: User | undefined = await this.userRepository.getOne(request);
        if(!userProfile) throw new UserNotFoundException()
        return userProfile;
    }
}
