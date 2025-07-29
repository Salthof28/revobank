import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";


export class ResponseTransactionDto {
    @ApiProperty({ example: '1', description: 'account id' })  
    @Expose()
    @Type(() => Number)
    id: number;

    @ApiProperty({ example: '4', description: 'account id' })  
    @Expose()
    @Type(() => Number)
    account_id: number;

    @ApiProperty({ example: '2', description: 'account id destination' })
    @Expose()
    @Type(() => Number)
    destination_account_id: number;

    @ApiProperty({ example: 'TRANSFER', description: 'only input TRANSFER or DEPOSIT or WITHDRAW because value use enum' })
    @Expose()
    @Type(() => String)
    transaction_type: string;
    
    @ApiProperty({ example: 'COMPLETED', description: 'only input COMPLETED or FAILED or PENDING because value use enum' })  
    @Expose()
    @Type(() => String)
    status: string; 

    @ApiProperty({ example: '50000000', description: 'amount transaction' })
    @Expose()
    @Type(() => Number)
    amount: number;

    @ApiProperty({ example: 'TR', description: 'only input TR or WH or DP because value use enum' })    
    @Expose()
    @Type(() => String)
    code_transaction_ref: string;

    @ApiPropertyOptional({ example: 'test transfer money', description: 'note transaction' }) 
    @Expose()
    @Type(() => String)
    description: string | null;

    @ApiProperty({ example: '2025-07-18 10:29:21.75+00', description: 'date update account' })
    @Expose()
    @Type(() => String)
    updated_at: Date | null;
}