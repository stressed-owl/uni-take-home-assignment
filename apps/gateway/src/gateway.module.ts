import { Module } from "@nestjs/common";
import { GatewayController } from "./gateway.controller";
import { HttpModule } from "@nestjs/axios";
import { NatsClientModule } from "@app/nats-client";
import { LoggerModule } from "nestjs-pino";
import { randomUUID } from "crypto";
import { ConfigModule } from "@nestjs/config";
import * as process from "node:process";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    HttpModule,
    NatsClientModule,
    LoggerModule.forRoot({
      pinoHttp: {
        // Use a random UUID for the request ID
        genReqId: (req, res) => {
          const existingId = req.id ?? req.headers["x-correlation-id"];
          if (existingId) return existingId;
          const id = randomUUID();
          res.setHeader("X-Correlation-Id", id);
          return id;
        },
        transport:
          process.env["NODE_ENV"] !== "prod"
            ? {
                target: "pino-pretty",
                options: {
                  singleLine: true,
                  colorize: true,
                },
              }
            : undefined,
        // Define a custom success message
        customSuccessMessage: function (req, res) {
          if (res.statusCode === 404) {
            return `Resource not found`;
          }
          return `${req.method} ${req.url} completed`;
        },
      },
    }),
  ],
  controllers: [GatewayController],
})
export class GatewayModule {}
