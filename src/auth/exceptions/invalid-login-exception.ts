import { RepositoryException } from "src/global/exception/exception.repository";


export class InvalidLoginException extends RepositoryException {
    constructor(message: string = 'email or passwrod invalid') {
        super(message);
        this.name = InvalidLoginException.name;
        Error.captureStackTrace(this, this.constructor);
    }
}