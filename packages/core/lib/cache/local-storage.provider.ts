import { ICacheProvider, CacheItem, CacheInitializationOptions, CachePolicy } from "./cache.service";
import { LogService } from "../logging/log.service";

export class LocalStorageCacheProvider implements ICacheProvider
{
     private prefix: string;

     /**
      * Constructor
      */
     constructor(private log: LogService)
     {
     }

     init(options: CacheInitializationOptions): Promise<ICacheProvider>
     {
          this.prefix = options.cacheName;

          return Promise.resolve<ICacheProvider>(this);
     }

     private key(key): string
     {
          return this.prefix + "_" + key;
     }

     get(key: string): Promise<CacheItem>
     {
          return new Promise<CacheItem>((resolve, reject) =>
          {
               this.performGet(key).then((item) =>
               {
                    if (item)
                    {
                         item.lastAccessed = new Date();
                         this.set(key, item);
                    }

                    resolve(item);
               },
               reject);
          });
     }

     private performGet(key: string): Promise<CacheItem>
     {
          return new Promise<CacheItem>((resolve, reject) =>
          {
               try
               {
                    let itemJson = localStorage[this.key(key)];

                    if (itemJson)
                    {
                         let item = JSON.parse(itemJson) as CacheItem;
                         resolve(item);
                    }
                    else
                    {
                         resolve(null);
                    }
               }
               catch (e)
               {
                    this.log.error(`Error getting items (${key}).`, e);
                    reject();
               }
          });
     }

     getAll(filter?: string): Promise<CacheItem[]>
     {
          return new Promise<CacheItem[]>((resolve, reject) =>
          {
               try
               {
                    let result: CacheItem[] = [];

                    for (let cacheKey of this.getAllKeys(filter))
                    {
                         let itemJson = localStorage.getItem(cacheKey);
                         if (itemJson) result.push((JSON.parse(itemJson) as CacheItem));
                    }

                    resolve(result);
               }
               catch (e)
               {
                    this.log.error("Error getting all items.", e);
                    reject();
               }
          });
     }

     private getAllKeys(filter?: string): string[]
     {
          let result: string[] = [];

          let prefix = this.key(filter || "");

          for (let i = 0; i < localStorage.length; i++)
          {
               let cacheKey = localStorage.key(i);
               if (cacheKey.startsWith(prefix))
               {
                    result.push(cacheKey);
               }
          }

          return result;
     }

     set(key: string, item: CacheItem): Promise<void>
     {
          return this.performSet(key, item, 0);
     }

     private performSet(key: string, item: CacheItem, attempt: number): Promise<void>
     {
          return new Promise<void>((resolve, reject) =>
          {
               if (attempt < 5)
               {
                    try
                    {
                         localStorage.setItem(this.key(key), JSON.stringify(item));
                    }
                    catch (e)
                    {
                         if (this.isQuotaExceeded(e))
                         {
                              // age off the least accesed and reattempt performSet
                              this.log.warn(`Error caching item (${key}) due to space quota. Clearing space and re-attempting...`);
                              this.ageOffLeastAccessed(15);
                              this.performSet(key, item, attempt + 1);
                              resolve();
                         }
                         else
                         {
                              this.log.error(`Error caching item (${key}). ${e.message} (${e.name})`);
                              reject();
                         }
                    }
               }
               else
               {
                    this.log.error(`Max attempts reached to cache item (${key}). Cache skipped.`);
                    reject();
               }
          });
     }

     private isQuotaExceeded(e): boolean
     {
          let quotaExceeded = false;

          if (e)
          {
               if (e.code)
               {
                    switch (e.code)
                    {
                         case 22:
                              quotaExceeded = true;
                              break;
                         case 1014:
                              // Firefox
                              if (e.name === "NS_ERROR_DOM_QUOTA_REACHED")
                              {
                                   quotaExceeded = true;
                              }
                              break;
                    }
               }
               else if (e.number === -2147024882)
               {
                    // Internet Explorer 8
                    quotaExceeded = true;
               }
          }

          return quotaExceeded;
     }

     private ageOffLeastAccessed(percentageToRemove: number)
     {
          // find all with session only or session data and order by last access
          this.getAll().then((all) =>
               {
                    let lastAccessedList = all.filter((item) =>
                    {
                         if (item.policy == CachePolicy.Session || item.policy == CachePolicy.SessionOnly) return true;
                         return false;
                    })
                    .sort((itemA,
                         itemB) =>
                    {
                         return this.getLastAccessed(itemA) - this.getLastAccessed(itemB);
                    });

                    // clear X%
                    if (lastAccessedList && lastAccessedList.length)
                    {
                         let countToRemove = Math.floor(lastAccessedList.length * percentageToRemove / 100);

                         this.log.debug(`Removing ${percentageToRemove}% of least accessed cached items (${countToRemove} items)...`);

                         let removalCandidates = lastAccessedList.slice(0, countToRemove);

                         for (let candidate of removalCandidates)
                         {
                              this.remove(candidate.key);
                         }

                         this.log.debug(`Remaining cached items: ${this.getAllKeys().length}`);
                    }
               },
               (reason) =>
               {
                    this.log.error("Unable to age off least accessed.", reason); 
               });
     }

     private getLastAccessed(item: CacheItem): number
     {
          if (item.lastAccessed) return new Date(item.lastAccessed).getTime();
          if (item.cachedOn) return new Date(item.cachedOn).getTime();
          return 0;
     }

     remove(key: string): Promise<void>
     {
          return new Promise<void>((resolve, reject) =>
          {
               try
               {
                    localStorage.removeItem(this.key(key));
                    resolve();
               }
               catch (e)
               {
                    this.log.error("Error removing item.", e);
                    reject();
               }
          });
     }

     clear(): Promise<void>
     {
          return new Promise<void>((resolve, reject) =>
          {
               try
               {
                    for (let key of this.getAllKeys())
                    {
                         localStorage.removeItem(key);
                    }

                    resolve();
               }
               catch (e)
               {
                    this.log.error("Error clearing items.", e);
                    reject();
               }
          });

          
     }
}
