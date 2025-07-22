import { Body, Controller, Delete, Get, HttpException, HttpStatus, InternalServerErrorException, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { UpdateAccountDto } from './dto/req/update-account.dto';
import { CreateAccountDto } from './dto/req/create-account.dto';
import { RepositoryException } from 'src/global/exception/exception.repository';
import { AuthGuard } from 'src/global/guards/auth.guard';
import { Role } from 'src/global/enum/role.enum';
import { Roles } from 'src/global/decorators/role.decorator';
import { TransformRes } from 'src/global/interceptors/transform-body-res.interceptor';
import { AccountBodyResDto } from './dto/res/account-body.dto';

@Controller('accounts')
@TransformRes(AccountBodyResDto)
export class AccountsController {
    constructor(private accountsService: AccountsService) {}

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    @Get()
    async getAllAccounts(@Query('account_name') account_name: string, @Query('account_number') account_number: string, @Query('branch_code') branch_code: string) {
        try {
            const allAccounts = await this.accountsService.getAllAccounts({
                account_name,
                account_number,
                branch_code
            });
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
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    @Post()
    async createAccountByAdmin(@Body() body: CreateAccountDto) {
        try {
            // console.log(body.user_id);
            const createdAccount = await this.accountsService.createAccount(body);
            return createdAccount;
        } catch (error) {
            if(error instanceof RepositoryException || error instanceof HttpException) throw error;           
            throw new InternalServerErrorException({
                message: 'something wrong on our side',
                error: 'internal server error',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            })           
        }  
    }
    @UseGuards(AuthGuard)
    @Post('register')
    async createAccountByUser(@Request() request, @Body() body: CreateAccountDto) {
        try {
            body.user_id = request.user.id;
            body.account_name = request.user.name;
            // console.log(body.user_id);
            const createdAccount = await this.accountsService.createAccount(body);
            return createdAccount;
        } catch (error) {
            if(error instanceof RepositoryException || error instanceof HttpException) throw error;           
            throw new InternalServerErrorException({
                message: 'something wrong on our side',
                error: 'internal server error',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            })           
        }  
    }

    @UseGuards(AuthGuard)
    @Get('/:id')
    async getAccount(@Param('id', ParseIntPipe) id: number) {
        try{
            const account = await this.accountsService.getAccount(id);
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

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    @Patch('/:id')
    updateAccount(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateAccountDto & { oldPin?: string }) {
        try {
            const updateAccount =  this.accountsService.updateAccount({
                id,
                account: body,
                oldPin: body.oldPin
            });
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
    @UseGuards(AuthGuard)
    @Delete('/:id')
    async deleteAccount(@Param('id', ParseIntPipe) id: number) {
        try {
            const deleteAccount = await this.accountsService.deleteAccount(id); 
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
