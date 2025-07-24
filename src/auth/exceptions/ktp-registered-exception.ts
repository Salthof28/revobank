import { RepositoryException } from "../../global/exception/exception.repository";


export class KtpRegisteredException extends RepositoryException {
    constructor(message: string = 'Number KTP Registered') {
        super(message);
        this.name = KtpRegisteredException.name;
        Error.captureStackTrace(this, this.constructor);
    }

}