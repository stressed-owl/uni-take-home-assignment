import { Injectable } from "@nestjs/common";
import { NatsClientService } from "@app/nats-client";

@Injectable()
export class TtkCollectorService {
  constructor(private readonly natsClientService: NatsClientService) {}

  async consumeMessage() {

  }
}
