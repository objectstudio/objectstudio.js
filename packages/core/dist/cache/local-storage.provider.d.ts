import { ICacheProvider, CacheItem, CacheInitializationOptions } from "./cache.service";
import { LogService } from "../logging/log.service";
export declare class LocalStorageCacheProvider implements ICacheProvider {
    private log;
    private prefix;
    /**
     * Constructor
     */
    constructor(log: LogService);
    init(options: CacheInitializationOptions): Promise<ICacheProvider>;
    private key(key);
    get(key: string): Promise<CacheItem>;
    private performGet(key);
    getAll(filter?: string): Promise<CacheItem[]>;
    private getAllKeys(filter?);
    set(key: string, item: CacheItem): Promise<void>;
    private performSet(key, item, attempt);
    private isQuotaExceeded(e);
    private ageOffLeastAccessed(percentageToRemove);
    private getLastAccessed(item);
    remove(key: string): Promise<void>;
    clear(): Promise<void>;
}
