import { RepositoryException } from "src/global/exception/exception.repository";


export class StatusAccountException extends RepositoryException {
    constructor(message: string = 'account INACTIVE cannot transfer'){
        super(message);
        this.name = StatusAccountException.name;
        Error.captureStackTrace(this, this.constructor)
    }
}