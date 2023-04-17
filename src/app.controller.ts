import { AppService } from './app.service';
import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  @HttpCode(204)
  root(): void {
    void 0;
  }
}
