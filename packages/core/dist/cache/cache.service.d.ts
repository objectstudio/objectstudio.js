import { LogService } from "../logging/log.service";
export declare class CacheService {
    private log;
    private store;
    private sessionID;
    private userID;
    /**
     * Constructor
     */
    constructor(log: LogService);
    /**
     * Set the Session ID and perform startup logic.
     * @param sessionID
     * @param purgeStaleSessionItems
     * @param store
     */
    init(options?: CacheInitializationOptions, store?: ICacheProvider): Promise<void>;
    /**
     * Perform operations on start of a new session.
     * @param purgeStaleSessionItems
     */
    private processNewSession;
    /**
     * Get an item from the store.
     * @param key
     */
    get(key: string): Promise<CacheItem>;
    /**
     * Get all items in store.
     */
    getAll(filter?: string): Promise<CacheItem[]>;
    /**
     * Get the value of item in the store.
     * @param key Null if not in the store.
     */
    getValue(key: string): Promise<any>;
    /**
     * Get the value as a specified type.
     * @param key
     * @param defaultValue
     */
    getValueAs<T>(key: string, defaultValue: T): Promise<T>;
    /**
     * Set the item in to the store with the specified cache behavior.
     * @param key
     * @param policy
     * @param value
     */
    set(key: string, policy: CachePolicy, value: any): Promise<CacheItem>;
    /**
     * Set an item for the current session (will be available but stale on subsequent sessions).
     * @param key
     * @param value
     */
    setForSession(key: string, value: any): Promise<CacheItem>;
    /**
     * Set an item for the current session only (will not be avialble on subsequent sessions).
     * @param key
     * @param value
     */
    setForSessionOnly(key: string, value: any): Promise<CacheItem>;
    /**
     * Set an item for the current the current user only.
     * @param key
     * @param value
     */
    setForUser(key: string, value: any): Promise<CacheItem>;
    /**
     * Set an item permanently.
     * @param key
     * @param value
     */
    setPermanently(key: string, value: any): Promise<CacheItem>;
    /**
     * Remove the specified item from the store.
     * @param key
     */
    remove(key: string): Promise<void>;
    /**
     * Remove all items from the store.
     */
    removeAll(): Promise<void>;
    /**
     * Mark an item dirty.
     * @param key
     */
    markDirty(key: string): Promise<void>;
    /**
     * Mark an item stale.
     * @param key
     */
    markStale(key: string): Promise<void>;
    /**
     *
     * @param userID
     */
    setUser(userID: string): Promise<void>;
    /**
     * True if an item is valid (not stale or dirty)
     * @param key
     */
    isValid(key: string): Promise<boolean>;
    /**
     * Get the value as a specified type.
     */
    static getValueAs<T>(item: CacheItem, defaultValue: T): T;
    /**
     * True if the itme is valid.
     * @param item
     */
    static isValid(item: CacheItem): boolean;
    /**
     * True if the cache item is value and not null.
     * @param item
     */
    static isValidAndNotNull(item: CacheItem): boolean;
    /**
     * Create a Unique ID (GUID) for use as a session key.
     */
    static createSessionID(): string;
}
export declare class CacheInitializationOptions {
    cacheName: string;
    sessionID: string;
    purgeStaleSessionItems: boolean;
}
export declare class CacheItem {
    key: string;
    userID: string;
    sessionID: string;
    policy: CachePolicy;
    dirty: boolean;
    stale: boolean;
    value: any;
    cachedOn: Date;
    lastAccessed: Date;
}
export declare enum CachePolicy {
    None = 0,
    Session = 1,
    User = 2,
    SessionOnly = 3,
    Permanent = 4
}
export interface ICacheProvider {
    init(options: CacheInitializationOptions): Promise<ICacheProvider>;
    get(key: string): Promise<CacheItem>;
    getAll(filter?: string): Promise<CacheItem[]>;
    set(key: string, item: CacheItem): Promise<void>;
    remove(key: string): Promise<void>;
    clear(): Promise<void>;
}
