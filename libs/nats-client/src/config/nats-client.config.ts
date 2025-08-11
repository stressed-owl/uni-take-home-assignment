import { registerAs } from "@nestjs/config";

export default registerAs("nats-client", () => ({
  url: process.env["NATS_URL"],
  user: process.env["NATS_USER"],
  password: process.env["NATS_PASSWORD"] || "",
  port: Number(process.env["NATS_PORT"]),
  monitoringPort: Number(process.env["NATS_MONITORING_PORT"]),
}));
