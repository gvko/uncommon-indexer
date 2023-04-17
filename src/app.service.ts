import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';

@Injectable()
export class AppService implements OnApplicationShutdown {
  private readonly logger = new Logger(AppService.name);

  onApplicationShutdown(): void {
    this.logger.log({ msg: 'the app is shutting down' });
  }
}
