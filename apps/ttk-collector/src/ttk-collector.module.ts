import { Module } from "@nestjs/common";
import { TtkCollectorController } from "./ttk-collector.controller";
import { TtkCollectorService } from "./ttk-collector.service";
import { NatsClientModule } from "@app/nats-client";

@Module({
  imports: [NatsClientModule],
  controllers: [TtkCollectorController],
  providers: [TtkCollectorService],
})
export class TtkCollectorModule {}
