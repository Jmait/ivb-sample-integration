import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export enum PaymentType {
  FIAT = 'FIAT',
  CRYPTO = 'CRYPTO',

}

export enum PaymentMode {
  API = 'API',
    CHECKOUT ='CHECKOUT',
}

export class InitiatePaymentDto {
  @ApiProperty({ example: 100 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ enum: PaymentType, example: PaymentType.FIAT })
  @IsEnum(PaymentType)
  type: PaymentType;

  @ApiPropertyOptional({ enum: PaymentMode, default: PaymentMode.API })
  @IsEnum(PaymentMode)
  @IsOptional()
  mode?: PaymentMode = PaymentMode.API;

  @ApiPropertyOptional({ default: 'USD' })
  @IsString()
  @IsOptional()
  baseFiat?: string = 'USD';

  @ApiPropertyOptional({ default: 'USDT' })
  @IsString()
  @IsOptional()
  crypto?: string = 'USDT';

  @ApiPropertyOptional({ default: 'ETHEREUM' })
  @IsString()
  @IsOptional()
  chain?: string = 'ETHEREUM';

  @ApiPropertyOptional({ type: Object, default: {} })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any> = {};
}
