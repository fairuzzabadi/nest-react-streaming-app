import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

describe('MailService', () => {
  let service: MailService;
  let configService: ConfigService;

  beforeEach(async () => {
    configService = new ConfigService();
    service = new MailService(configService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
