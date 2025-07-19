import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsRepositoryItf } from './transactions.repository.interface';

@Injectable()
export class TransactionsRepository implements TransactionsRepositoryItf {

}