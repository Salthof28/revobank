import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, InternalServerErrorException, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { UpdateAccountDto } from './dto/req/update-account.dto';
import { CreateAccountDto } from './dto/req/create-account.dto';
import { RepositoryException } from '../global/exception/exception.repository';
import { AuthGuard } from '../global/guards/auth.guard';
import { Role } from '../global/enum/role.enum';
import { Roles } from '../global/decorators/role.decorator';
import { TransformRes } from '../global/interceptors/transform-body-res.interceptor';
import { AccountBodyResDto } from './dto/res/account-body.dto';
import { AccountsServiceItf } from './accounts.service.interface';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('accounts')
@TransformRes(AccountBodyResDto)
export class AccountsController {
    constructor(@Inject('AccountsServiceItf') private accountsService: AccountsServiceItf) {}

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    @Get()
    @ApiOperation({ summary: 'get all accounts users' })
    @ApiQuery({ name: 'account_name', required: false, description: 'Filter by name account (opsional)' })
    @ApiQuery({ name: 'account_number', required: false, description: 'Filter by number account (opsional)' }) 
    @ApiQuery({ name: 'branch_code', required: false, description: 'Filter by branch code (opsional)' }) 
    @ApiResponse({ status: 200, description: 'success get all user', type: AccountBodyResDto, isArray: true })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getAllAccounts(@Query('account_name') account_name?: string, @Query('account_number') account_number?: string, @Query('branch_code') branch_code?: string) {
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
    @ApiOperation({ summary: 'Register a new account (admin only)' })
    @ApiBody({ type: CreateAccountDto })
    @ApiResponse({ status: 201, description: 'account successfully registered', type: AccountBodyResDto })
    @ApiResponse({ status: 500, description: 'Internal server error' })
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
    @ApiOperation({ summary: 'Register a new account' })
    @ApiBody({ type: CreateAccountDto })
    @ApiResponse({ status: 201, description: 'account successfully registered', type: AccountBodyResDto })
    @ApiResponse({ status: 500, description: 'Internal server error' })
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
    @ApiOperation({ summary: 'get account by id' })
    @ApiParam({ name: 'id', type: 'number', description: 'id account' })
    @ApiResponse({ status: 200, description: 'success get account by id', type: AccountBodyResDto })
    @ApiResponse({ status: 500, description: 'Internal server error' })
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
    @ApiOperation({ summary: 'update a new account (admin only)' })
    @ApiParam({ name: 'id', type: 'number', description: 'id account' })
    @ApiBody({ type: CreateAccountDto })
    @ApiResponse({ status: 200, description: 'account successfully updated', type: AccountBodyResDto })
    @ApiResponse({ status: 500, description: 'Internal server error' })
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
    @ApiOperation({ summary: 'deleted account by id' })
    @ApiParam({ name: 'id', type: 'number', description: 'id account' })
    @ApiResponse({ status: 200, description: 'success deleted account by id', type: AccountBodyResDto })
    @ApiResponse({ status: 500, description: 'Internal server error' })
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
