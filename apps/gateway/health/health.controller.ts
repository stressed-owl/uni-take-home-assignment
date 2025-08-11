import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService, HttpHealthIndicator, PrismaHealthIndicator,
} from "@nestjs/terminus";

@Controller("health")
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly prisma: PrismaHealthIndicator,
  ) {}

  @Get("liveness")
  @HealthCheck()
  checkLiveness(): Promise<HealthCheckResult> {
    return this.health.check([]);
  }

  @Get("readiness")
  @HealthCheck()
  checkReadiness(): Promise<HealthCheckResult> {
    return this.health.check([
      () =>
        this.http.pingCheck("fb-collector-service", "http://fb-collector:3002"),
      () =>
        this.http.pingCheck(
          "ttk-collector-service",
          "http://ttk-collector:3003",
        ),
      () => this.http.pingCheck("reporter-service", "http://reporter:3004"),
    ]);
  }
}
