import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';
// import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}
