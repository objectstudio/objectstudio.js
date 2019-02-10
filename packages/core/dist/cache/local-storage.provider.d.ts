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
    private key;
    get(key: string): Promise<CacheItem>;
    private performGet;
    getAll(filter?: string): Promise<CacheItem[]>;
    private getAllKeys;
    set(key: string, item: CacheItem): Promise<void>;
    private performSet;
    private isQuotaExceeded;
    private ageOffLeastAccessed;
    private getLastAccessed;
    remove(key: string): Promise<void>;
    clear(): Promise<void>;
}
