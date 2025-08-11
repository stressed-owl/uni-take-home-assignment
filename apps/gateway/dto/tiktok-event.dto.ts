import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from "class-validator";
import { BaseEventDto } from "./base-event.dto";
import { Type } from "class-transformer";

export class TiktokEventDto extends BaseEventDto {
  @IsEnum(["tiktok"])
  source: "tiktok";

  @IsString()
  @IsNotEmpty()
  eventType: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  data: Record<string, any>;
}
