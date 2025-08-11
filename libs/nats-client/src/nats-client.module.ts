import { Module } from "@nestjs/common";
import { NatsClientService } from "./nats-client.service";
import { ConfigModule } from "@nestjs/config";
import natsClientConfig from "@app/nats-client/config/nats-client.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [natsClientConfig],
    }),
  ],
  providers: [NatsClientService],
  exports: [NatsClientService],
})
export class NatsClientModule {}
