import { Controller, Get, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
    constructor(private accountsService: AccountsService) {}

    @Get()
    getAllAccounts(@Query('accountName') accountName: string) {
        return this.accountsService.getAllAccounts(accountName)
    }
}
