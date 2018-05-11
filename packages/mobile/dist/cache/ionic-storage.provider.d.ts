import { Storage } from '@ionic/storage';
import { ICacheProvider, CacheItem, CacheInitializationOptions } from "@objecstudio.js/core";
export declare class IonicStorageCacheProvider implements ICacheProvider {
    private storage;
    constructor(storage: Storage);
    init(options: CacheInitializationOptions): Promise<ICacheProvider>;
    get(key: string): Promise<CacheItem>;
    getAll(): Promise<CacheItem[]>;
    set(key: string, item: CacheItem): Promise<void>;
    remove(key: string): Promise<void>;
    clear(): Promise<void>;
}
