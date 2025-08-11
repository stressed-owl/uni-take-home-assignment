import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class BaseEventDto {
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  timestamp: string;

  @IsEnum(["top", "bottom"])
  funnelStage: "top" | "bottom";
}
