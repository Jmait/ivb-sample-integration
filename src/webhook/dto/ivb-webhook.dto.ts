import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsObject } from 'class-validator';

export enum IvbEvent {
  FIAT_COLLECTION_PENDING = 'fiatCollection.pending',
  FIAT_COLLECTION_SUCCESS = 'fiatCollection.success',
  FIAT_COLLECTION_FAILED = 'fiatCollection.failed',
  FIAT_COLLECTION_PROCESSING = 'fiatCollection.processing',
  CRYPTO_COLLECTION_PENDING = 'cryptoCollection.pending',
  CRYPTO_COLLECTION_SUCCESS = 'cryptoCollection.success',
  CRYPTO_COLLECTION_FAILED = 'cryptoCollection.failed',
  CRYPTO_COLLECTION_PROCESSING = 'cryptoCollection.processing',
  FIAT_PAYOUT_PENDING = 'fiatPayout.pending',
  FIAT_PAYOUT_SUCCESS = 'fiatPayout.success',
  FIAT_PAYOUT_FAILED = 'fiatPayout.failed',
  FIAT_PAYOUT_PROCESSING = 'fiatPayout.processing',
  CRYPTO_PAYOUT_PENDING = 'cryptoPayout.pending',
  CRYPTO_PAYOUT_SUCCESS = 'cryptoPayout.success',
  CRYPTO_PAYOUT_FAILED = 'cryptoPayout.failed',
  CRYPTO_PAYOUT_PROCESSING = 'cryptoPayout.processing',
}

export interface IvbWebhookData {
  reference: string;
  cryptoTransactionHash: string | null;
  expectedAmountInCrypto: number;
  receivedAmountInCrypto: number;
  settledAmountInCrypto: number;
  token: string;
  address: string | null;
  metadata: Record<string, any> | null;
  environment: string;
  expiresAt: string;
  completedAt: string;
  origin: string;
  status: string;
  failureReason: string | null;
}

export class IvbWebhookDto {
  @ApiProperty({ enum: IvbEvent, example: IvbEvent.FIAT_COLLECTION_SUCCESS })
  @IsNotEmpty()
  @IsEnum(IvbEvent)
  event: IvbEvent;

  @ApiProperty({ type: Object })
  @IsObject()
  data: IvbWebhookData;
}
