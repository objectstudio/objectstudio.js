var IonicStorageCacheProvider = /** @class */ (function () {
    function IonicStorageCacheProvider(storage) {
        this.storage = storage;
    }
    IonicStorageCacheProvider.prototype.init = function (options) {
        return Promise.resolve(this);
    };
    IonicStorageCacheProvider.prototype.get = function (key) {
        var _this = this;
        if (key) {
            return new Promise(function (resolve, reject) {
                _this.storage.get(key)
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
    IonicStorageCacheProvider.prototype.getAll = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.storage.keys().then(function (keys) {
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
    IonicStorageCacheProvider.prototype.set = function (key, item) {
        var _this = this;
        if (key) {
            if (item) {
                return new Promise(function (resolve, reject) {
                    _this.storage.set(key, JSON.stringify(item))
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
    IonicStorageCacheProvider.prototype.remove = function (key) {
        var _this = this;
        if (key) {
            return new Promise(function (resolve, reject) {
                _this.storage.remove(key)
                    .then(function () { resolve(); }, reject);
            });
        }
        else {
            return Promise.reject("Key not provided.");
        }
    };
    IonicStorageCacheProvider.prototype.clear = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.storage.clear().then(resolve, reject);
        });
    };
    return IonicStorageCacheProvider;
}());
export { IonicStorageCacheProvider };
//# sourceMappingURL=ionic-storage.provider.js.map