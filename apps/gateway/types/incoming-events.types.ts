import { TiktokEventDto } from "../dto/tiktok-event.dto";
import { FacebookEventDto } from "../dto/facebook-event.dto";

export type IncomingEventDto = FacebookEventDto | TiktokEventDto;
