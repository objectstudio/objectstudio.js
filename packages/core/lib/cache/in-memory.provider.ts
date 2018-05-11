import { ICacheProvider, CacheItem, CacheInitializationOptions } from "./cache.service";

export class InMemoryCacheProvider implements ICacheProvider
{
  private store: any = {};

  init(options: CacheInitializationOptions): Promise<ICacheProvider>
  {
    this.clear();

    return Promise.resolve<ICacheProvider>(this);
  }

  private performGet(key): CacheItem
  {
    if (this.store[key])
    {
      let item = this.store[key] as CacheItem;
      item.lastAccessed = new Date();
      return item;
    }

    return null;
  }

  get(key: string): Promise<CacheItem>
  {
    return Promise.resolve(this.performGet(key));
  }

  getAll(filter?: string): Promise<CacheItem[]>
  {
    let result: CacheItem[] = [];
    for (let prop in this.store)
    {
      if (filter && !prop.startsWith(filter))
      {
        continue;
      }

      if (this.store.hasOwnProperty(prop))
      {
        let item = this.performGet(prop);
        if (item) result.push(item);
      }
    }

    return Promise.resolve(result);
  }

  set(key: string, item: CacheItem): Promise<void>
  {
    this.store[key] = item;

    return Promise.resolve();
  }

  remove(key: string): Promise<void>
  {
    if (this.store[key])
    {
      delete this.store[key];
    }

    return Promise.resolve();
  }

  clear(): Promise<void>
  {
    this.store = {};
    return Promise.resolve();
  }
}
