import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { connect, JetStreamClient, JSONCodec, NatsConnection } from "nats";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NatsClientService implements OnModuleInit, OnModuleDestroy {
  private natsConnection: NatsConnection;
  private jetStreamClient: JetStreamClient;
  private readonly jsonCodec = JSONCodec();

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    try {
      this.natsConnection = await connect({
        servers: this.configService.get<string>("nats-client.url"),
        user: this.configService.get<string>("nats-client.user"),
        pass: this.configService.get<string>("nats-client.password"),
      });
      this.jetStreamClient = this.natsConnection.jetstream();
    } catch (error) {
      console.error("Failed to connect to NATS server", error);
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.natsConnection) {
      console.log("Draining and closing NATS connection...");
      await this.natsConnection.drain();
      console.log("NATS connection closed.");
    }
  }

  async publish(subject: string, data: Record<string, any>): Promise<void> {
    if (!this.jetStreamClient) {
      console.error("Cannot publish: JetStream client is not initialized");
      throw new Error("Not connected to NATS server");
    }

    try {
      const encodeData = this.jsonCodec.encode(data);
      const publishAck = await this.jetStreamClient.publish(
        subject,
        encodeData,
      );
      console.log(
        `Published message to subject [${subject}], stream [${publishAck.stream}], sequence [${publishAck.seq}]`,
      );
    } catch (error) {
      console.error(`Failed to publish to subject [${subject}]`, error);
      throw error;
    }
  }

  async subscribe(
    streamName: string,
    durableName: string,
    callback: (data: any) => void,
  ): Promise<void> {
    if (!this.jetStreamClient) {
      console.error("Cannot subscribe: JetStream client is not initialized.");
      throw new Error("NATS JetStream client not available.");
    }

    const jsm = await this.natsConnection.jetstreamManager();

    await jsm.streams.add({
      name: streamName,
      subjects: [`${streamName}.*`],
    });

    const consumer = await this.jetStreamClient.consumers.get(
      streamName,
      durableName,
    );
    const messages = await consumer.consume();

    await (async () => {
      for await (const message of messages) {
        try {
          const decodedData = this.jsonCodec.decode(message.data);
          callback(decodedData);
          message.ack();
        } catch (error) {
          console.error(
            `Error processing message for durable [${durableName}]`,
            error,
          );
          message.nak(1000);
        }
      }
    })();
  }
}
