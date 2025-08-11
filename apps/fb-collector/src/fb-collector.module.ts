import { Module } from "@nestjs/common";
import { FbCollectorController } from "./fb-collector.controller";
import { FbCollectorService } from "./fb-collector.service";
import { NatsClientModule } from "@app/nats-client";

@Module({
  imports: [NatsClientModule],
  controllers: [FbCollectorController],
  providers: [FbCollectorService],
})
export class FbCollectorModule {}
