import { Test, TestingModule } from "@nestjs/testing";
import { NatsClientService } from "./nats-client.service";

describe("NatsClientService", () => {
  let service: NatsClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NatsClientService],
    }).compile();

    service = module.get<NatsClientService>(NatsClientService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
