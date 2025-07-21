import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreateTransactionDto } from './create-transaction.dto';


export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
    @IsString()
    updated_at: Date | null;
}
