import { Injectable } from "@nestjs/common";
import { NatsClientService } from "@app/nats-client";

@Injectable()
export class FbCollectorService {
  constructor(private readonly natsClientService: NatsClientService) {}

  async consumeMessage() {

  }
}
