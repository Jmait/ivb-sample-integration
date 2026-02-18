import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NetworksTokenController } from './networks-token.controller';
import { NetworksTokenService } from './networks-token.service';

@Module({
  imports: [HttpModule],
  controllers: [NetworksTokenController],
  providers: [NetworksTokenService],
})
export class NetworksTokenModule {}
