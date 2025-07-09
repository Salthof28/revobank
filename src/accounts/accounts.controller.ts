import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { UpdateAccountDto } from './dto/req/update-account.dto';
import { CreateAccountDto } from './dto/req/create-account.dto';

@Controller('accounts')
export class AccountsController {
    constructor(private accountsService: AccountsService) {}

    @Get()
    getAllAccounts(@Query('accountName') accountName: string) {
        return this.accountsService.getAllAccounts({accountName})
    }

    @Post()
    createAccount(@Body() body: CreateAccountDto) {
        return this.accountsService.createAccount({body})
    }

    @Get('/:accountNumber')
    getAccount(@Param('accountNumber', ParseIntPipe) accountNumber: number) {
        return this.accountsService.getAccount({ accountNumber });
    }

    @Patch('/:accountNumber')
    updateAccount(@Param('accountNumber', ParseIntPipe) accountNumber: number, @Body() body: UpdateAccountDto) {
        return this.accountsService.updateAccount({accountNumber, body})
    }

    @Delete('/:accountNumber')
    deleteAccount(@Param('accountNumber', ParseIntPipe) accountNumber: number) {
        return this.accountsService.deleteAccount({accountNumber});
    }
}
