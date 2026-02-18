import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FiatPayoutController } from './fiat-payout.controller';
import { FiatPayoutService } from './fiat-payout.service';
import { TransactionModule } from '../transaction/transaction.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [HttpModule, TransactionModule, UserModule],
  controllers: [FiatPayoutController],
  providers: [FiatPayoutService],
  exports: [FiatPayoutService],
})
export class FiatPayoutModule {}
