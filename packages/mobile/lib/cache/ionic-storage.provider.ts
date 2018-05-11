import { Storage } from '@ionic/storage';
import { ICacheProvider, CacheItem, CacheInitializationOptions } from "@objecstudio.js/core"

export class IonicStorageCacheProvider implements ICacheProvider
{
	constructor(private storage: Storage)
	{

	}

	init(options: CacheInitializationOptions): Promise<ICacheProvider>
	{
		return Promise.resolve<ICacheProvider>(this);
	}

	get(key: string): Promise<CacheItem>
	{
		if (key)
		{
			return new Promise<CacheItem>((resolve, reject) =>
			{
				this.storage.get(key)
					.then((valueJSON) =>
					{
						let value = <CacheItem>JSON.parse(valueJSON);
						resolve(value);
					},
					reject);
			});
		}
		else
		{
			return Promise.reject("Key not provided.");
		}
	}

	getAll(): Promise<CacheItem[]>
	{
		return new Promise<CacheItem[]>((resolve, reject) =>
		{
			this.storage.keys().then((keys) =>
			{
				let retreivals: Promise<CacheItem>[] = [];

				keys.forEach((key, index) =>
				{
					retreivals.push(this.get(key));
				});

				Promise.all(retreivals).then((items) =>
				{
					resolve(items);
				});
			},
				reject);
		});
	}

	set(key: string, item: CacheItem): Promise<void>
	{
		if (key)
		{
			if (item)
			{
				return new Promise<void>((resolve, reject) =>
				{
					this.storage.set(key, JSON.stringify(item))
						.then(() => { resolve(); },
						reject);
				});
			}
			else 
			{
				return this.remove(key);
			}
		}
		else
		{
			return Promise.reject("Key not provided.");
		}
	}

	remove(key: string): Promise<void>
	{
		if (key)
		{
			return new Promise<void>((resolve, reject) =>
			{
				this.storage.remove(key)
					.then(() => { resolve(); },
					reject);
			});
		}
		else
		{
			return Promise.reject("Key not provided.");
		}
	}

	clear(): Promise<void>
	{
		return new Promise<void>((resolve, reject) =>
		{
			this.storage.clear().then(resolve, reject);
		});
	}
}
