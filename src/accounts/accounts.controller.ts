import { Body, Controller, Delete, Get, HttpStatus, InternalServerErrorException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { UpdateAccountDto } from './dto/req/update-account.dto';
import { CreateAccountDto } from './dto/req/create-account.dto';
import { RepositoryException } from 'src/global/exception/exception.repository';

@Controller('accounts')
export class AccountsController {
    constructor(private accountsService: AccountsService) {}

    @Get()
    getAllAccounts(@Query('accountName') accountName: string) {
        try {
            const allAccounts = this.accountsService.getAllAccounts({accountName});
            return allAccounts;
        } catch (error) {
            if(error instanceof RepositoryException) throw error;           
            throw new InternalServerErrorException({
                message: 'something wrong on our side',
                error: 'internal server error',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            })
        }
        
    }

    @Post()
    createAccount(@Body() body: CreateAccountDto) {
        try {
            const createdAccount = this.accountsService.createAccount({body});
            return createdAccount
        } catch (error) {
            if(error instanceof RepositoryException) throw error;           
            throw new InternalServerErrorException({
                message: 'something wrong on our side',
                error: 'internal server error',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            })           
        }
        
    }

    @Get('/:accountNumber')
    getAccount(@Param('accountNumber', ParseIntPipe) accountNumber: number) {
        try{
            const account =  this.accountsService.getAccount({ accountNumber });
            return account;
        } catch (error) {
            if(error instanceof RepositoryException) throw error;
            throw new InternalServerErrorException({
                message: 'something wrong on our side',
                error: 'internal server error',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            })
        }
        
    }

    @Patch('/:accountNumber')
    updateAccount(@Param('accountNumber', ParseIntPipe) accountNumber: number, @Body() body: UpdateAccountDto) {
        try {
            const updateAccount =  this.accountsService.updateAccount({accountNumber, body});
            return updateAccount;
        } catch (error) {
            if(error instanceof RepositoryException) throw error;
            throw new InternalServerErrorException({
                message: 'something wrong on our side',
                error: 'internal server error',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            })
        }
        
    }

    @Delete('/:accountNumber')
    deleteAccount(@Param('accountNumber', ParseIntPipe) accountNumber: number) {
        try {
            const deleteAccount =  this.accountsService.deleteAccount({accountNumber}); 
            return deleteAccount
        } catch (error) {
            if(error instanceof RepositoryException) throw error;
            throw new InternalServerErrorException({
                message: 'something wrong on our side',
                error: 'internal server error',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            })
        }
        
    }
}
