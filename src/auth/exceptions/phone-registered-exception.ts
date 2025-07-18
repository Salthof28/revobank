import { RepositoryException } from "src/global/exception/exception.repository";


export class PhoneRegisteredException extends RepositoryException {
    constructor(message: string = 'Number Phone Registered') {
        super(message);
        this.name = PhoneRegisteredException.name;
        Error.captureStackTrace(this, this.constructor);
    }
}