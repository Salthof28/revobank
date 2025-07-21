import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus, HttpException } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { AccountNotFoundRepositoryException } from "src/accounts/exceptions/account-not-found.exception";
import { EmailRegisteredException } from "src/auth/exceptions/email-registered-exception";
import { InvalidLoginException } from "src/auth/exceptions/invalid-login-exception";
import { KtpRegisteredException } from "src/auth/exceptions/ktp-registered-exception";
import { PhoneRegisteredException } from "src/auth/exceptions/phone-registered-exception";
import { RepositoryException } from "src/global/exception/exception.repository";
import { OldPasswordException } from "src/user/exceptions/old-password-exception";
import { UserNotFoundException } from "src/user/exceptions/user-not-found.exception";
import { NotInputException } from "../exception/no-input-exception";
import { StatusAccountException } from "src/transactions/exceptions/status-account-exception";
import { InvalidTypeTransactionException } from "src/transactions/exceptions/invalid-type-transaction-exception";
import { TransactionNotFound } from "src/transactions/exceptions/transaction-not-found-exception";
import { AccountNumberRegisteredException } from "src/accounts/exceptions/account-number-registered.exception";
import { PinAccountException } from "src/accounts/exceptions/pin.exception";



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
        else if (exception instanceof UserNotFoundException) {
            responseBody = {
                message: exception.message,
                error: exception.name,
                statusCode: HttpStatus.NOT_FOUND,
            }
        }
        else if (exception instanceof EmailRegisteredException) {
            responseBody = {
                message: exception.message,
                error: exception.name,
                statusCode: HttpStatus.CONFLICT,
            }
        }
        else if (exception instanceof KtpRegisteredException) {
            responseBody = {
                message: exception.message,
                error: exception.name,
                statusCode: HttpStatus.CONFLICT,
            }
        }
        else if (exception instanceof PhoneRegisteredException) {
            responseBody = {
                message: exception.message,
                error: exception.name,
                statusCode: HttpStatus.CONFLICT,
            }
        }
        else if (exception instanceof InvalidLoginException) {
            responseBody = {
                message: exception.message,
                error: exception.name,
                statusCode: HttpStatus.BAD_REQUEST
            }
        }
        else if (exception instanceof OldPasswordException) {
            responseBody = {
                message: exception.message,
                error: exception.name,
                statusCode: HttpStatus.BAD_REQUEST
            }
        }
        else if (exception instanceof NotInputException) {
            responseBody = {
                message: exception.message,
                error: exception.name,
                statusCode: HttpStatus.BAD_REQUEST
            }
        }
        else if (exception instanceof StatusAccountException) {
            responseBody = {
                message: exception.message,
                error: exception.name,
                statusCode: HttpStatus.BAD_REQUEST
            }
        }
        else if (exception instanceof InvalidTypeTransactionException) {
            responseBody = {
                message: exception.message,
                error: exception.name,
                statusCode: HttpStatus.BAD_REQUEST
            }
        }
        else if (exception instanceof TransactionNotFound) {
            responseBody = {
                message: exception.message,
                error: exception.name,
                statusCode: HttpStatus.BAD_REQUEST
            }
        }
        else if (exception instanceof AccountNumberRegisteredException) {
            responseBody = {
                message: exception.message,
                error: exception.name,
                statusCode: HttpStatus.BAD_REQUEST
            }
        }
        else if (exception instanceof PinAccountException) {
            responseBody = {
                message: exception.message,
                error: exception.name,
                statusCode: HttpStatus.BAD_REQUEST
            }
        }
        // res.status(responseBody.statusCode).send(responseBody);
        // filter exception return custom exception
        httpAdapter.reply(res, responseBody, responseBody.statusCode);
    }
    
}