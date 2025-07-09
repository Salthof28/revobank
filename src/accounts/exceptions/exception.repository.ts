export class RepositoryException extends Error {
    constructor(message: string = 'repository error') {
        // call construct parent class
        super(message);
        // setting name exception be the name class itself
        this.name = RepositoryException.name;
        // catch stack trace (jejak error) for debugging, that can see throw the error
        Error.captureStackTrace(this, this.constructor)
    }
}