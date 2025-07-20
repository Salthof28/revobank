import { RepositoryException } from "src/global/exception/exception.repository";


export class TransferFailedException extends RepositoryException {
    constructor(message: string = 'insufficient balance'){
        super(message);
        this.name = TransferFailedException.name;
        Error.captureStackTrace(this, this.constructor)
    }
}