import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class FiatPayoutDto {
  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'USDT' })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({ example: 'USD' })
  @IsNotEmpty()
  @IsString()
  fiatCurrency: string;



  @ApiProperty({ example: 'BANK_TRANSFER' })
  @IsNotEmpty()
  @IsString()
  payoutMethod: string;

  @ApiProperty({ example: '0123456789' })
  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @ApiProperty({ example: 'bank-id' })
  @IsNotEmpty()
  @IsString()
  bankId: string;
}
