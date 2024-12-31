import { Body, Controller, Post } from '@nestjs/common';
import { WompiService } from './wompi.service';

@Controller('wompi')
export class WompiController {
  constructor(private readonly wompiService: WompiService) {}
  @Post('webhook')
  async webhook(@Body() body: any) {
    console.log('Webhook received:', body);
    await this.wompiService.processWebhook(body);
    return 'ok';
  }
}
