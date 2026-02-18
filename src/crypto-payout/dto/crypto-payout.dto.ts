import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CryptoPayoutDto {
  @ApiProperty({ example: 'ETHEREUM' })
  @IsNotEmpty()
  @IsString()
  network: string;

  @ApiProperty({ example: '0x1234567890abcdef1234567890abcdef12345678' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0.01)
  amount: number;
}
