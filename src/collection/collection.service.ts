import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { firstValueFrom } from 'rxjs';
import { InitiatePaymentDto, PaymentType } from './dto/initiate-payment.dto';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionStatus, TransactionType } from '../transaction/transaction.entity';

@Injectable()
export class CollectionService {
  private readonly baseUrl: string;
  private readonly secretKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly transactionService: TransactionService,
  ) {
    this.baseUrl = this.configService.getOrThrow('IVB_BASE_URL');
    this.secretKey = this.configService.getOrThrow('IVB_SECRET_KEY');
  }

  async initiatePayment(dto: InitiatePaymentDto, userId: number) {
    const reference = randomUUID();

    const payload = {
      amount: dto.amount,
      email: dto.email,
      type: dto.type,
      mode: dto.mode,
      reference,
      baseFiat: dto.baseFiat,
      crypto: dto.crypto,
      chain: dto.chain,
      metadata: dto.metadata,
    };

    const { data } = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/transactions`, payload, {
        headers: {
          Authorization: this.secretKey,
          'Content-Type': 'application/json',
        },
      })
    ).catch((error) => {
      throw error.response?.data || error;
    });

    await this.transactionService.create({
      reference,
      amount: dto.amount,
      type: dto.type === PaymentType.FIAT ? TransactionType.FIAT_COLLECTION : TransactionType.CRYPTO_COLLECTION,
      status: TransactionStatus.PENDING,
      email: dto.email,
      token: dto.crypto,
      chain: dto.chain,
      userId,
    });

    return data;
  }
}
