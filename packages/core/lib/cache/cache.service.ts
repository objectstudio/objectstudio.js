import { Injectable } from "@angular/core";
import { v4 as uuid } from 'uuid';
import { LogService } from "../logging/log.service";
import { InMemoryCacheProvider } from "./in-memory.provider";


// consider "area" support (allowing different caches for different types of data)
// create a local storage and file storage provider

@Injectable()
export class CacheService
{
     private store: ICacheProvider = null;

     private sessionID: string = null;

     private userID: string = null;

     /**
      * Constructor
      */
     constructor(private log: LogService)
     {
          this.store = new InMemoryCacheProvider();
     }

     /**
      * Set the Session ID and perform startup logic.
      * @param sessionID
      * @param purgeStaleSessionItems
      * @param store
      */
     init(options?: CacheInitializationOptions, store?: ICacheProvider): Promise<void>
     {
          return new Promise<void>((resolve, reject) =>
          {
               // create a default session if none is supplied
               if (!options) options = new CacheInitializationOptions();
               if (!options.sessionID) options.sessionID = CacheService.createSessionID();

               this.log.info("Initializing Cache (Session: " + options.sessionID + ")...");

               this.sessionID = options.sessionID;

               if (store)
               {
                    this.store = store;
               }
               else
               {
                    store = this.store;
               }

               this.log.info("Initializing Cache Provider...");

               // init the provider
               store.init(options).then(() =>
               {
                    // then validate each item
                    this.processNewSession(options.purgeStaleSessionItems).then(() =>
                    {
                         this.log.info("Provider Initialized.");
                         resolve();
                    },
                    reject);
               },
               (reason) =>
               {
                    // log issue
                    this.log.error("Unable to initialize cache.", reason);

                    // notify callers
                    reject(reason);
               });
          });
     }

     /**
      * Perform operations on start of a new session.
      * @param purgeStaleSessionItems
      */
     private processNewSession(purgeStaleSessionItems: boolean): Promise<void>
     {
          return new Promise<void>((resolve, reject) =>
          {
               // ensure all items are valid for the current user
               this.getAll().then((all) =>
               {
                    for (let item of all)
                    {
                         let stale = false;

                         // if not associated to current session, mark stale
                         if (this.sessionID && item.sessionID && item.sessionID != this.sessionID)
                         {
                              stale = true;
                         }

                         // if no session and has session id, mark stale
                         else if (!this.sessionID && item.sessionID)
                         {
                              stale = true;
                         }

                         // if stale, take approriate policy action
                         if (stale)
                         {

                              if (item.policy == CachePolicy.SessionOnly)
                              {
                                   this.log.debug("Removing Cache Item (" + item.key + ", " + item.policy + ")");
                                   this.store.remove(item.key);
                              }
                              else if (item.policy == CachePolicy.Session && purgeStaleSessionItems)
                              {
                                   this.log.debug("Removing Cache item (" + item.key + ", " + item.policy + ")");
                                   this.store.remove(item.key);
                              }
                              else
                              {
                                   this.log.debug("Marking Cache Item Stale (" + item.key + ", " + item.policy + ")");
                                   item.stale = true;
                                   this.store.set(item.key, item);
                              }
                         }
                    }

                    // notify callers
                    resolve();
               },
                    reject);
          });
     }

     /**
      * Get an item from the store.
      * @param key
      */
     get(key: string): Promise<CacheItem>
     {
          return this.store.get(key);
     }

     /**
      * Get all items in store.
      */
     getAll(filter?: string): Promise<CacheItem[]>
     {
          return this.store.getAll(filter);
     }

     /**
      * Get the value of item in the store.
      * @param key Null if not in the store.
      */
     getValue(key: string): Promise<any>
     {
          return new Promise<any>((resolve, reject) =>
          {
               this.get(key).then((item) =>
               {
                    resolve(CacheService.getValueAs<any>(item, null));
               },
                    reject);
          });
     }

     /**
      * Get the value as a specified type.
      * @param key
      * @param defaultValue
      */
     getValueAs<T>(key: string, defaultValue: T): Promise<T>
     {
          return new Promise<T>((resolve, reject) =>
          {
               this.get(key).then((item) =>
               {
                    resolve(CacheService.getValueAs<T>(item, defaultValue));
               },
                    reject);
          });
     }

     /**
      * Set the item in to the store with the specified cache behavior.
      * @param key
      * @param policy
      * @param value
      */
     set(key: string, policy: CachePolicy, value: any): Promise<CacheItem>
     {
          let item = new CacheItem();
          item.key = key;
          item.policy = policy;
          item.stale = false;
          item.dirty = false;
          item.value = value;
          item.cachedOn = new Date();

          if (policy == CachePolicy.Session) item.sessionID = this.sessionID;
          if (policy == CachePolicy.SessionOnly) item.sessionID = this.sessionID;
          if (policy == CachePolicy.User)
          {
               item.userID = this.userID;
               item.sessionID = this.sessionID;
          }

          this.log.debug("Caching Item (" + item.key + ", " + item.policy + ")");

          return new Promise<CacheItem>((resolve, reject) =>
          {
               this.store.set(key, item).then(() =>
               {
                    resolve(item);
               },
                    reject);
          });
     }

     /**
      * Set an item for the current session (will be available but stale on subsequent sessions).
      * @param key
      * @param value
      */
     setForSession(key: string, value: any): Promise<CacheItem>
     {
          return this.set(key, CachePolicy.Session, value);
     }

     /**
      * Set an item for the current session only (will not be avialble on subsequent sessions).
      * @param key
      * @param value
      */
     setForSessionOnly(key: string, value: any): Promise<CacheItem>
     {
          return this.set(key, CachePolicy.SessionOnly, value);
     }

     /**
      * Set an item for the current the current user only.
      * @param key
      * @param value
      */
     setForUser(key: string, value: any): Promise<CacheItem>
     {
          return this.set(key, CachePolicy.User, value);
     }

     /**
      * Set an item permanently.
      * @param key
      * @param value
      */
     setPermanently(key: string, value: any): Promise<CacheItem>
     {
          return this.set(key, CachePolicy.Permanent, value);
     }

     /**
      * Remove the specified item from the store.
      * @param key
      */
     remove(key: string): Promise<void>
     {
          return this.store.remove(key);
     }

     /**
      * Remove all items from the store.
      */
     removeAll(): Promise<void>
     {
          return this.store.clear();
     }

     /**
      * Mark an item dirty.
      * @param key
      */
     markDirty(key: string): Promise<void>
     {
          return new Promise<void>((resolve, reject) =>
          {
               this.store.get(key).then((item) =>
               {
                    if (item)
                    {
                         item.dirty = true;
                         this.store.set(key, item).then(resolve, reject);
                    }

                    resolve();
               },
                    (reason) =>
                    {
                         reject(reason);
                    });
          });
     }

     /**
      * Mark an item stale.
      * @param key
      */
     markStale(key: string): Promise<void>
     {
          return new Promise<void>((resolve, reject) =>
          {
               this.store.get(key).then((item) =>
               {
                    if (item)
                    {
                         item.stale = true;
                         this.store.set(key, item).then(resolve, reject);
                    }

                    resolve();
               },
                    reject);
          });
     };

     /**
      *
      * @param userID
      */
     setUser(userID: string): Promise<void>
     {
          return new Promise<void>((resolve, reject) =>
          {
               this.userID = userID;

               // ensure all items are valid for the current user
               this.getAll().then((all) =>
               {
                    let operations: Promise<void>[] = [];

                    for (let item of all)
                    {
                         // if not associated to current user, remove
                         if (this.userID && item.userID && item.userID != this.userID)
                         {
                              this.log.debug("Removing Cache Item (" + item.key + ", " + item.policy + ")");
                              operations.push(this.store.remove(item.key));
                         }

                         // if no current user and has user, remove
                         else if (!this.userID && item.userID)
                         {
                              this.log.debug("Removing Cache Item (" + item.key + ", " + item.policy + ")");
                              operations.push(this.store.remove(item.key));
                         }
                    }

                    // notify callers
                    Promise.all(operations).then(() => { resolve() }, reject);
               },
                    reject);
          });
     }

     /**
      * True if an item is valid (not stale or dirty)
      * @param key
      */
     isValid(key: string): Promise<boolean>
     {
          return new Promise<boolean>((resolve, reject) =>
          {
               this.get(key).then((item) =>
               {
                    resolve(CacheService.isValid(item));
               },
                    reject);
          });
     }

     /**
      * Get the value as a specified type.
      */
     static getValueAs<T>(item: CacheItem, defaultValue: T): T
     {
          if (item && (item.value as T) != null) return item.value as T;
          return defaultValue;
     }

     /**
      * True if the itme is valid.
      * @param item
      */
     static isValid(item: CacheItem): boolean
     {
          if (!item) return false;
          if (item.stale) return false;
          if (item.dirty) return false;
          return true;
     }

     /**
      * True if the cache item is value and not null.
      * @param item
      */
     static isValidAndNotNull(item: CacheItem): boolean
     {
          return CacheService.isValid(item) && item.value != null;
     }

     /**
      * Create a Unique ID (GUID) for use as a session key.
      */
     static createSessionID(): string
     {
          return uuid();
     }
}

export class CacheInitializationOptions
{
     cacheName: string;

     sessionID: string;

     purgeStaleSessionItems: boolean = false;
}

export class CacheItem
{
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

export enum CachePolicy
{
     None,

     Session,

     User,

     SessionOnly,

     Permanent
}

export interface ICacheProvider
{
     init(options: CacheInitializationOptions): Promise<ICacheProvider>;

     get(key: string): Promise<CacheItem>;

     getAll(filter?: string): Promise<CacheItem[]>;

     set(key: string, item: CacheItem): Promise<void>;

     remove(key: string): Promise<void>;

     clear(): Promise<void>;
}
