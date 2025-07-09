import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus, HttpException } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { AccountNotFoundRepositoryException } from "src/accounts/exceptions/account-not-found.exception";
import { RepositoryException } from "src/global/exception/exception.repository";



@Catch(RepositoryException)
export class ExceptionFilterRepository implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
    
    catch(exception: RepositoryException, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        let responseBody = {
            message: 'something wrong on our side',
            error: 'internal server error',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        }

        if (exception instanceof AccountNotFoundRepositoryException) {
            // data custom exception / error response
            responseBody = {
                message: exception.message,
                error: exception.name,
                statusCode: HttpStatus.NOT_FOUND,
            }
        }
        // res.status(responseBody.statusCode).send(responseBody);
        // filter exception return custom exception
        httpAdapter.reply(res, responseBody, responseBody.statusCode);
    }
    
}