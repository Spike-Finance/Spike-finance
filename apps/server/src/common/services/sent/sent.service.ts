import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpClient } from '@nestjs/http-client';

export const DEFAULT_SERVICE_TEMPLATE = '2bee1355-748a-472f-a1a5-27bc005a74d7';

interface ISentMessagePayload {
  channel: Array<'sms' | 'whatsapp' | 'rcs'>;
  template: {
    id: string;
    [key: string]: any;
  };
  to: Array<string>;
}

export type ISentResponse = {
  success: boolean;
  data: {
    status: string;
    template_id: string;
    template_name: string;
    recipients: Array<{
      message_id: string;
      to: string;
      channel: string;
    }>;
  };
  error: any;
  meta: {
    request_id: string;
    timestamp: string;
    version: string;
  };
};

@Injectable()
export class SentService {
  private logger = new Logger(SentService.name);
  private readonly baseUrl = 'https://api.sent.io/v1/';
  constructor(
    private readonly configService: ConfigService,
    private httpService: HttpClient,
  ) {}

  public async sendMessage(
    payload: ISentMessagePayload,
  ): Promise<ISentResponse> {
    try {
      const response = await this.httpService.post<ISentResponse>(
        this.baseUrl,
        {
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.configService.getOrThrow<string>('SENT_API_KEY'),
          },
        },
      );
      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
