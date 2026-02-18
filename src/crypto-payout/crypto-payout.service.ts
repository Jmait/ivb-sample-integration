import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { firstValueFrom } from 'rxjs';
import { CryptoPayoutDto } from './dto/crypto-payout.dto';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionStatus, TransactionType } from '../transaction/transaction.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class CryptoPayoutService {
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

  async initiatePayout(dto: CryptoPayoutDto, userId: number) {
    await this.userService.debitBalance(userId, dto.amount);

    const reference = randomUUID();

    const payload = {
      network: dto.network,
      address: dto.address,
      amount: dto.amount,
      reference,
    };

    const { data } = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/crypto-payout/initiate`, payload, {
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
      type: TransactionType.CRYPTO_PAYOUT,
      status: TransactionStatus.PENDING,
      chain: dto.network,
      userId,
    });

    return data;
  }
}
