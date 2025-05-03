import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { VentingLoungeGateway } from './venting-lounge.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [AppGateway, VentingLoungeGateway],
})
export class AppModule {}
