import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CryptoPayoutService } from './crypto-payout.service';
import { CryptoPayoutDto } from './dto/crypto-payout.dto';

@ApiTags('Crypto Payouts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crypto-payouts')
export class CryptoPayoutController {
  constructor(private readonly cryptoPayoutService: CryptoPayoutService) {}

  @Post()
  initiatePayout(@Body() dto: CryptoPayoutDto, @Req() req: any) {
    return this.cryptoPayoutService.initiatePayout(dto, req.user.id);
  }
}
