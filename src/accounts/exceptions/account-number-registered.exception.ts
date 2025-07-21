import { RepositoryException } from "../../global/exception/exception.repository";

export class AccountNumberRegisteredException extends RepositoryException {
    constructor(message: string = 'Account Number Registered') {
        // call construct parent class
        super(message);
        // setting name exception be the name class itself
        this.name = AccountNumberRegisteredException.name;
        // catch stack trace (jejak error) for debugging, that can see throw the error
        Error.captureStackTrace(this, this.constructor);
    }
}