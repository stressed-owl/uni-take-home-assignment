import { NestFactory } from "@nestjs/core";
import { GatewayModule } from "./gateway.module";
import { ValidationPipe } from "@nestjs/common";
import { Logger } from "nestjs-pino";

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.port ?? 3000);
}

void bootstrap();
