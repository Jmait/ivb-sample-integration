import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NetworksTokenService {
  private readonly baseUrl: string;
  private readonly secretKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.getOrThrow('IVB_BASE_URL');
    this.secretKey = this.configService.getOrThrow('IVB_SECRET_KEY');
  }

  async getSupportedNetworkTokens() {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/business-tokens/supported/network-tokens`, {
        headers: {
          Authorization: this.secretKey,
        },
      }),
    ).catch((error) => {
      throw error.response?.data || error;
    });

    return data;
  }

  async getNetworksByToken(token: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/${token}/networks`, {
        headers: {
          Authorization: this.secretKey,
        },
      }),
    ).catch((error) => {
      throw error.response?.data || error;
    });

    return data;
  }
}
