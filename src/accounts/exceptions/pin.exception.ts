import { RepositoryException } from "../../global/exception/exception.repository";

export class PinAccountException extends RepositoryException {
    constructor(message: string = 'pin is too short (standard 6 character number)') {
        // call construct parent class
        super(message);
        // setting name exception be the name class itself
        this.name = PinAccountException.name;
        // catch stack trace (jejak error) for debugging, that can see throw the error
        Error.captureStackTrace(this, this.constructor);
    }
}