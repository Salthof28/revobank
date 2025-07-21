import { RepositoryException } from "src/global/exception/exception.repository";


export class TransactionNotFound extends RepositoryException {
    constructor(message: string = 'transaction not found'){
        super(message);
        this.name = TransactionNotFound.name;
        Error.captureStackTrace(this, this.constructor)
    }
}