import { Injectable } from "@angular/core";
import { CacheService } from "./cache/cache.service";
import { LogService } from "./logging/log.service";
import { AlertsService } from "./alerts/alerts.service";

@Injectable()
export class Core
{
     constructor(public log: LogService,
          public cache: CacheService,
          public alerts: AlertsService)
  {

  }
}
