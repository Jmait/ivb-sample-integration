import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCollectionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  amount: number;
}
