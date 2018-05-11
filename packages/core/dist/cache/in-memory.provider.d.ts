import { ICacheProvider, CacheItem, CacheInitializationOptions } from "./cache.service";
export declare class InMemoryCacheProvider implements ICacheProvider {
    private store;
    init(options: CacheInitializationOptions): Promise<ICacheProvider>;
    private performGet(key);
    get(key: string): Promise<CacheItem>;
    getAll(filter?: string): Promise<CacheItem[]>;
    set(key: string, item: CacheItem): Promise<void>;
    remove(key: string): Promise<void>;
    clear(): Promise<void>;
}
