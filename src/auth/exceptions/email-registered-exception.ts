import { RepositoryException } from "src/global/exception/exception.repository";


export class EmailRegisteredException extends RepositoryException {
    constructor(message: string = 'Email Registered') {
        // call construct parent class
        super(message);
        // setting name exception be the name class itself
        this.name = EmailRegisteredException.name;
        // catch stack trace (jejak error) for debugging, that can see throw the error
        Error.captureStackTrace(this, this.constructor)
    }

}