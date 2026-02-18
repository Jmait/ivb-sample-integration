import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FiatPayoutService } from './fiat-payout.service';
import { FiatPayoutDto } from './dto/fiat-payout.dto';

@ApiTags('Fiat Payouts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fiat-payouts')
export class FiatPayoutController {
  constructor(private readonly fiatPayoutService: FiatPayoutService) {}

  @Get('banks')
  getBanks() {
    return this.fiatPayoutService.getBanks();
  }

  @Post()
  initiatePayout(@Body() dto: FiatPayoutDto, @Req() req: any) {
    return this.fiatPayoutService.initiatePayout(dto, req.user.id);
  }
}
