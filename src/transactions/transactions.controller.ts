import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, InternalServerErrorException, HttpStatus, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/req/create-transaction.dto';
import { RepositoryException } from 'src/global/exception/exception.repository';
import { Transaction } from './entities/transaction.entity';
import { AuthGuard } from 'src/global/guards/auth.guard';
import { Roles } from 'src/global/decorators/role.decorator';
import { Role } from 'src/global/enum/role.enum';
import { UpdateTransactionDto } from './dto/req/update-transaction.dto';
import { PinAccountException } from 'src/accounts/exceptions/pin.exception';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllTransaction(@Query('transaction_type') transaction_type: string, @Query('status') status: string, @Query('code_transaction_ref') code_transaction_ref: string): Promise<Transaction[]> {
    try {
      const allTransaction: Transaction[] = await this.transactionsService.getAllTransaction({
        transaction_type,
        status,
        code_transaction_ref
      });
      return allTransaction;
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
  @Get(':id')
  async getOneTransaction (@Param('id', ParseIntPipe) id: number): Promise<Transaction> {
    try {
      const transaction: Transaction = await this.transactionsService.getOneTransaction(id);
      return transaction;
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
  @Roles(Role.ADMIN)
  @Patch(':id')
  async updateTransaction(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTransactionDto): Promise<Transaction> {
    try {
      const updateTransaction: Transaction = await this.transactionsService.updateTransaction({
        id,
        transaction: body
      });
      return updateTransaction;
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
  @Post('transfer')
  async accountTransfer(@Body() body: CreateTransactionDto & { pinAccount: string }): Promise<Transaction> {
    try {
      if(!body.pinAccount) throw new PinAccountException('please input your pin'); 
      const transfer: Transaction = await this.transactionsService.transactionTransfer({
        body,
        pinAccount: body.pinAccount
      });
      return transfer;
    } catch (error){
      if(error instanceof RepositoryException || error instanceof HttpException) throw error;           
      throw new InternalServerErrorException({
        message: 'something wrong on our side',
        error: 'internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      })     
    }
  }

  @UseGuards(AuthGuard)
  @Post('withdraw')
  async accountWithdraw(@Body() body: CreateTransactionDto & { pinAccount: string }): Promise<Transaction> {
    try {
      if(!body.pinAccount) throw new PinAccountException('please input your pin'); 
      const withdraw: Transaction = await this.transactionsService.transactionWithdraw({
        body,
        pinAccount: body.pinAccount
      });
      return withdraw;
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
  @Post('deposit')
  async accountDeposit(@Body() body: CreateTransactionDto & { pinAccount: string }): Promise<Transaction> {
    try {
      if(!body.pinAccount) throw new PinAccountException('please input your pin'); 
      const deposit: Transaction = await this.transactionsService.transactionDeposit({
        body,
        pinAccount: body.pinAccount
      });
      return deposit;
    } catch (error) {
      if(error instanceof RepositoryException || error instanceof HttpException) throw error;           
      throw new InternalServerErrorException({
        message: 'something wrong on our side',
        error: 'internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      })  
    }
  }
}
