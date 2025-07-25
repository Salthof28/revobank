import { RepositoryException } from "../../global/exception/exception.repository";


export class InvalidTypeTransactionException extends RepositoryException {
    constructor(message: string = 'invalid transaction_type'){
        super(message);
        this.name = InvalidTypeTransactionException.name;
        Error.captureStackTrace(this, this.constructor);
    }
}