import { CacheService } from './cache/cache.service';
import { LogService } from './logging/log.service';
import { AlertsService } from './alerts/alerts.service';
export declare class Core {
    log: LogService;
    cache: CacheService;
    alerts: AlertsService;
    constructor(log: LogService, cache: CacheService, alerts: AlertsService);
}
export declare class CoreModule {
}
export * from './alerts';
export * from './cache';
export * from './logging';
