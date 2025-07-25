import { RepositoryException } from "../../global/exception/exception.repository";


export class UserNotFoundException extends RepositoryException {
    constructor(message: string = 'user not found') {
        // call construct parent class
        super(message);
        // setting name exception be the name class itself
        this.name = UserNotFoundException.name;
        // catch stack trace (jejak error) for debugging, that can see throw the error
        Error.captureStackTrace(this, this.constructor)
    }

}