import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { NatsClientService } from "@app/nats-client";
import { PinoLogger } from "nestjs-pino";
import { IncomingEventDto } from "../types/incoming-events.types";

@Controller("gateway")
export class GatewayController {
  constructor(
    private readonly natsClientService: NatsClientService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(GatewayController.name);
  }

  @Post("/events/webhook")
  @HttpCode(HttpStatus.ACCEPTED)
  async handlePublisherEvents(@Body() event: IncomingEventDto): Promise<{
    status: string;
    subject: string;
    eventId: string;
  }> {
    const subject = `${event.source}.${event.funnelStage}.${event.eventType}`;

    try {
      await this.natsClientService.publish(subject, event);

      this.logger.info(`Successfully published event [${event.eventId}]`);

      return {
        status: "event received and queued",
        subject: subject,
        eventId: event.eventId,
      };
    } catch (error) {
      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        { err: error, eventId: event.eventId },
        `Failed to publish event to NATS.`,
      );
      throw error;
    }
  }
}
