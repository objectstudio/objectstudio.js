import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { ICacheProvider, CacheItem, CacheInitializationOptions } from "@objecstudio.js/core";

export class SecureStorageCacheProvider implements ICacheProvider
{
	private store: SecureStorageObject;

	constructor(private secureStorage: SecureStorage)
	{

	}

	init(options: CacheInitializationOptions): Promise<ICacheProvider>
	{
		return new Promise<ICacheProvider>((resolve, reject) =>
		{
			if (!options.cacheName)
			{
				options.cacheName = "APP_CACHE";
			}

			this.secureStorage.create(options.cacheName).then((storage: SecureStorageObject) =>
			{
				this.store = storage;

				resolve(this);
			},
				(reason: string) =>
				{
					reject(reason);
				});
		});
	}

	get(key: string): Promise<CacheItem>
	{
		if (key)
		{
			return new Promise<CacheItem>((resolve, reject) =>
			{
				this.store.get(key)
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
			this.store.keys().then((keys) =>
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
					this.store.set(key, JSON.stringify(item))
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
				this.store.remove(key)
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
		let result = new Promise<void>((resolve, reject) =>
		{
			this.store.clear()
				.then(resolve, reject);
		});
		return result;
	}
}
