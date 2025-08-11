import { BaseEventDto } from "./base-event.dto";
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class FacebookEventDto extends BaseEventDto {
  @IsEnum(["facebook"])
  source: "facebook";

  @IsString()
  @IsNotEmpty()
  eventType: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  data: Record<string, any>;
}
