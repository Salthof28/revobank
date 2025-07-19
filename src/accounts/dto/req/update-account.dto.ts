import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';
import { IsString } from 'class-validator';
// import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
    @IsString()
    updated_at: Date | null;
}
