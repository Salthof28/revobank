import { RepositoryException } from "./exception.repository";


export class NotInputException extends RepositoryException {
    constructor(message: string = 'no input please write the input') {
        // call construct parent class
        super(message);
        // setting name exception be the name class itself
        this.name = NotInputException.name;
        // catch stack trace (jejak error) for debugging, that can see throw the error
        Error.captureStackTrace(this, this.constructor)
    }

}