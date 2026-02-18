import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NetworksTokenService } from './networks-token.service';

@ApiBearerAuth()
@ApiTags('Networks & Tokens')
@Controller('ivb')
export class NetworksTokenController {
  constructor(private readonly networksTokenService: NetworksTokenService) {}

  @Get('supported/network-tokens')
  getSupportedNetworkTokens() {
    return this.networksTokenService.getSupportedNetworkTokens();
  }

  @Get(':token/networks')
  getNetworksByToken(@Param('token') token: string) {
    return this.networksTokenService.getNetworksByToken(token);
  }
}
