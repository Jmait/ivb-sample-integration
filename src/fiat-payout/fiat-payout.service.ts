import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { firstValueFrom } from 'rxjs';
import { FiatPayoutDto } from './dto/fiat-payout.dto';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionStatus, TransactionType } from '../transaction/transaction.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class FiatPayoutService {
  private readonly baseUrl: string;
  private readonly secretKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly transactionService: TransactionService,
    private readonly userService: UserService,
  ) {
    this.baseUrl = this.configService.getOrThrow('IVB_BASE_URL');
    this.secretKey = this.configService.getOrThrow('IVB_SECRET_KEY');
  }

  async getBanks() {
    console.log('Fetching banks from IVB...', this.secretKey);
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/banks`, {
        headers: {
          Authorization: this.secretKey,
        },
      }),
    ).catch((error) => {
      throw error.response?.data || error;
    });

    return data;
  }

  async initiatePayout(dto: FiatPayoutDto, userId: number) {
    await this.userService.debitBalance(userId, dto.amount);

    const reference = randomUUID();

    const USDT_TO_NGN_RATE = 1600;
    const amountInUsdt = dto.amount / USDT_TO_NGN_RATE;

    const payload = {
      amount: amountInUsdt,
      token: dto.token,
      fiatCurrency: dto.fiatCurrency,
      payoutMethod: dto.payoutMethod,
      accountNumber: dto.accountNumber,
      bankId: dto.bankId,
      reference,
    };

    const { data } = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/fiat-payout/initiate`, payload, {
        headers: {
          Authorization: this.secretKey,
          'Content-Type': 'application/json',
        },
      }),
    ).catch((error) => {
      throw error.response?.data || error;
    });

    await this.transactionService.create({
      reference,
      amount: dto.amount,
      type: TransactionType.FIAT_PAYOUT,
      status: TransactionStatus.PENDING,
      token: dto.token,
      userId,
    });

    return data;
  }
}
