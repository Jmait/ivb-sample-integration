import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CryptoPayoutController } from './crypto-payout.controller';
import { CryptoPayoutService } from './crypto-payout.service';
import { TransactionModule } from '../transaction/transaction.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [HttpModule, TransactionModule, UserModule],
  controllers: [CryptoPayoutController],
  providers: [CryptoPayoutService],
  exports: [CryptoPayoutService],
})
export class CryptoPayoutModule {}
