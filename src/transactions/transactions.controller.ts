import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, InternalServerErrorException, HttpStatus, UseGuards, Query, ParseIntPipe, Inject } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/req/create-transaction.dto';
import { RepositoryException } from '../global/exception/exception.repository';
import { Transaction } from './entities/transaction.entity';
import { AuthGuard } from '../global/guards/auth.guard';
import { Roles } from '../global/decorators/role.decorator';
import { Role } from '../global/enum/role.enum';
import { UpdateTransactionDto } from './dto/req/update-transaction.dto';
import { PinAccountException } from '../accounts/exceptions/pin.exception';
import { TransactionsServiceItf } from './transactions.service.interface';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseTransactionDto } from './dto/res/res-transaction.dto';

@ApiTags('Transactions')
@ApiBearerAuth() 
@Controller('transactions')
export class TransactionsController {
  constructor(@Inject('TransactionsServiceItf') private readonly transactionsService: TransactionsServiceItf) {}
  
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'get all transactions user (admin only)' })
  @ApiQuery({ name: 'status', required: false, description: 'status transaction (optional)' })
  @ApiResponse({ status: 200, description: 'success get all transactions user', type: ResponseTransactionDto, isArray: true })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllTransaction(@Query('transaction_type') transaction_type?: string, @Query('status') status?: string, @Query('code_transaction_ref') code_transaction_ref?: string): Promise<Transaction[]> {
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
  @ApiOperation({ summary: 'get transaction by id' })
  @ApiParam({ name: 'id', type: 'number', description: 'id transaction' })
  @ApiResponse({ status: 200, description: 'success get transaction by id', type: ResponseTransactionDto })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
  @ApiOperation({ summary: 'update a new transaction (admin only)' })
  @ApiParam({ name: 'id', type: 'number', description: 'id account' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 200, description: 'transaction successfully updated', type: ResponseTransactionDto })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
  @ApiOperation({ summary: 'create a new transfer' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 201, description: 'transfer successfully created', type: ResponseTransactionDto })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
  @ApiOperation({ summary: 'create a new withdraw' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 201, description: 'withdraw successfully created', type: ResponseTransactionDto })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
  @ApiOperation({ summary: 'create a new deposit' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 201, description: 'deposit successfully created', type: ResponseTransactionDto })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
