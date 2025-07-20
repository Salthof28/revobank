import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, InternalServerErrorException, HttpStatus, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { RepositoryException } from 'src/global/exception/exception.repository';
import { Transaction } from './entities/transaction.entity';
import { AuthGuard } from 'src/global/guards/auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard)
  @Post('transfer')
  async transferProcess(@Body() body: CreateTransactionDto): Promise<Transaction> {
    try {
      const transfer: Transaction = await this.transactionsService.transfer(body);
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
}
