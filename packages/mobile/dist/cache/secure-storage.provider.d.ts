import { SecureStorage } from '@ionic-native/secure-storage';
import { ICacheProvider, CacheItem, CacheInitializationOptions } from "@objecstudio.js/core";
export declare class SecureStorageCacheProvider implements ICacheProvider {
    private secureStorage;
    private store;
    constructor(secureStorage: SecureStorage);
    init(options: CacheInitializationOptions): Promise<ICacheProvider>;
    get(key: string): Promise<CacheItem>;
    getAll(): Promise<CacheItem[]>;
    set(key: string, item: CacheItem): Promise<void>;
    remove(key: string): Promise<void>;
    clear(): Promise<void>;
}
