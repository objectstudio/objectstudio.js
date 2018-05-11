import { CachePolicy } from "./cache.service";
var LocalStorageCacheProvider = /** @class */ (function () {
    /**
     * Constructor
     */
    function LocalStorageCacheProvider(log) {
        this.log = log;
    }
    LocalStorageCacheProvider.prototype.init = function (options) {
        this.prefix = options.cacheName;
        return Promise.resolve(this);
    };
    LocalStorageCacheProvider.prototype.key = function (key) {
        return this.prefix + "_" + key;
    };
    LocalStorageCacheProvider.prototype.get = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.performGet(key).then(function (item) {
                if (item) {
                    item.lastAccessed = new Date();
                    _this.set(key, item);
                }
                resolve(item);
            }, reject);
        });
    };
    LocalStorageCacheProvider.prototype.performGet = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var itemJson = localStorage[_this.key(key)];
                if (itemJson) {
                    var item = JSON.parse(itemJson);
                    resolve(item);
                }
                else {
                    resolve(null);
                }
            }
            catch (e) {
                _this.log.error("Error getting items (" + key + ").", e);
                reject();
            }
        });
    };
    LocalStorageCacheProvider.prototype.getAll = function (filter) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var result = [];
                for (var _i = 0, _a = _this.getAllKeys(filter); _i < _a.length; _i++) {
                    var cacheKey = _a[_i];
                    var itemJson = localStorage.getItem(cacheKey);
                    if (itemJson)
                        result.push(JSON.parse(itemJson));
                }
                resolve(result);
            }
            catch (e) {
                _this.log.error("Error getting all items.", e);
                reject();
            }
        });
    };
    LocalStorageCacheProvider.prototype.getAllKeys = function (filter) {
        var result = [];
        var prefix = this.key(filter || "");
        for (var i = 0; i < localStorage.length; i++) {
            var cacheKey = localStorage.key(i);
            if (cacheKey.startsWith(prefix)) {
                result.push(cacheKey);
            }
        }
        return result;
    };
    LocalStorageCacheProvider.prototype.set = function (key, item) {
        return this.performSet(key, item, 0);
    };
    LocalStorageCacheProvider.prototype.performSet = function (key, item, attempt) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (attempt < 5) {
                try {
                    localStorage.setItem(_this.key(key), JSON.stringify(item));
                }
                catch (e) {
                    if (_this.isQuotaExceeded(e)) {
                        // age off the least accesed and reattempt performSet
                        _this.log.warn("Error caching item (" + key + ") due to space quota. Clearing space and re-attempting...");
                        _this.ageOffLeastAccessed(15);
                        _this.performSet(key, item, attempt + 1);
                        resolve();
                    }
                    else {
                        _this.log.error("Error caching item (" + key + "). " + e.message + " (" + e.name + ")");
                        reject();
                    }
                }
            }
            else {
                _this.log.error("Max attempts reached to cache item (" + key + "). Cache skipped.");
                reject();
            }
        });
    };
    LocalStorageCacheProvider.prototype.isQuotaExceeded = function (e) {
        var quotaExceeded = false;
        if (e) {
            if (e.code) {
                switch (e.code) {
                    case 22:
                        quotaExceeded = true;
                        break;
                    case 1014:
                        // Firefox
                        if (e.name === "NS_ERROR_DOM_QUOTA_REACHED") {
                            quotaExceeded = true;
                        }
                        break;
                }
            }
            else if (e.number === -2147024882) {
                // Internet Explorer 8
                quotaExceeded = true;
            }
        }
        return quotaExceeded;
    };
    LocalStorageCacheProvider.prototype.ageOffLeastAccessed = function (percentageToRemove) {
        var _this = this;
        // find all with session only or session data and order by last access
        this.getAll().then(function (all) {
            var lastAccessedList = all.filter(function (item) {
                if (item.policy == CachePolicy.Session || item.policy == CachePolicy.SessionOnly)
                    return true;
                return false;
            })
                .sort(function (itemA, itemB) {
                return _this.getLastAccessed(itemA) - _this.getLastAccessed(itemB);
            });
            // clear X%
            if (lastAccessedList && lastAccessedList.length) {
                var countToRemove = Math.floor(lastAccessedList.length * percentageToRemove / 100);
                _this.log.debug("Removing " + percentageToRemove + "% of least accessed cached items (" + countToRemove + " items)...");
                var removalCandidates = lastAccessedList.slice(0, countToRemove);
                for (var _i = 0, removalCandidates_1 = removalCandidates; _i < removalCandidates_1.length; _i++) {
                    var candidate = removalCandidates_1[_i];
                    _this.remove(candidate.key);
                }
                _this.log.debug("Remaining cached items: " + _this.getAllKeys().length);
            }
        }, function (reason) {
            _this.log.error("Unable to age off least accessed.", reason);
        });
    };
    LocalStorageCacheProvider.prototype.getLastAccessed = function (item) {
        if (item.lastAccessed)
            return new Date(item.lastAccessed).getTime();
        if (item.cachedOn)
            return new Date(item.cachedOn).getTime();
        return 0;
    };
    LocalStorageCacheProvider.prototype.remove = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                localStorage.removeItem(_this.key(key));
                resolve();
            }
            catch (e) {
                _this.log.error("Error removing item.", e);
                reject();
            }
        });
    };
    LocalStorageCacheProvider.prototype.clear = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                for (var _i = 0, _a = _this.getAllKeys(); _i < _a.length; _i++) {
                    var key = _a[_i];
                    localStorage.removeItem(key);
                }
                resolve();
            }
            catch (e) {
                _this.log.error("Error clearing items.", e);
                reject();
            }
        });
    };
    return LocalStorageCacheProvider;
}());
export { LocalStorageCacheProvider };
//# sourceMappingURL=local-storage.provider.js.map