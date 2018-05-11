var SecureStorageCacheProvider = /** @class */ (function () {
    function SecureStorageCacheProvider(secureStorage) {
        this.secureStorage = secureStorage;
    }
    SecureStorageCacheProvider.prototype.init = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!options.cacheName) {
                options.cacheName = "APP_CACHE";
            }
            _this.secureStorage.create(options.cacheName).then(function (storage) {
                _this.store = storage;
                resolve(_this);
            }, function (reason) {
                reject(reason);
            });
        });
    };
    SecureStorageCacheProvider.prototype.get = function (key) {
        var _this = this;
        if (key) {
            return new Promise(function (resolve, reject) {
                _this.store.get(key)
                    .then(function (valueJSON) {
                    var value = JSON.parse(valueJSON);
                    resolve(value);
                }, reject);
            });
        }
        else {
            return Promise.reject("Key not provided.");
        }
    };
    SecureStorageCacheProvider.prototype.getAll = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.store.keys().then(function (keys) {
                var retreivals = [];
                keys.forEach(function (key, index) {
                    retreivals.push(_this.get(key));
                });
                Promise.all(retreivals).then(function (items) {
                    resolve(items);
                });
            }, reject);
        });
    };
    SecureStorageCacheProvider.prototype.set = function (key, item) {
        var _this = this;
        if (key) {
            if (item) {
                return new Promise(function (resolve, reject) {
                    _this.store.set(key, JSON.stringify(item))
                        .then(function () { resolve(); }, reject);
                });
            }
            else {
                return this.remove(key);
            }
        }
        else {
            return Promise.reject("Key not provided.");
        }
    };
    SecureStorageCacheProvider.prototype.remove = function (key) {
        var _this = this;
        if (key) {
            return new Promise(function (resolve, reject) {
                _this.store.remove(key)
                    .then(function () { resolve(); }, reject);
            });
        }
        else {
            return Promise.reject("Key not provided.");
        }
    };
    SecureStorageCacheProvider.prototype.clear = function () {
        var _this = this;
        var result = new Promise(function (resolve, reject) {
            _this.store.clear()
                .then(resolve, reject);
        });
        return result;
    };
    return SecureStorageCacheProvider;
}());
export { SecureStorageCacheProvider };
//# sourceMappingURL=secure-storage.provider.js.map