import { RepositoryException } from "src/global/exception/exception.repository";


export class OldPasswordException extends RepositoryException {
    constructor(message: string = 'old password wrong') {
        // call construct parent class
        super(message);
        // setting name exception be the name class itself
        this.name = OldPasswordException.name;
        // catch stack trace (jejak error) for debugging, that can see throw the error
        Error.captureStackTrace(this, this.constructor)
    }

}