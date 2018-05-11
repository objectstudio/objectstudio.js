var InMemoryCacheProvider = /** @class */ (function () {
    function InMemoryCacheProvider() {
        this.store = {};
    }
    InMemoryCacheProvider.prototype.init = function (options) {
        this.clear();
        return Promise.resolve(this);
    };
    InMemoryCacheProvider.prototype.performGet = function (key) {
        if (this.store[key]) {
            var item = this.store[key];
            item.lastAccessed = new Date();
            return item;
        }
        return null;
    };
    InMemoryCacheProvider.prototype.get = function (key) {
        return Promise.resolve(this.performGet(key));
    };
    InMemoryCacheProvider.prototype.getAll = function (filter) {
        var result = [];
        for (var prop in this.store) {
            if (filter && !prop.startsWith(filter)) {
                continue;
            }
            if (this.store.hasOwnProperty(prop)) {
                var item = this.performGet(prop);
                if (item)
                    result.push(item);
            }
        }
        return Promise.resolve(result);
    };
    InMemoryCacheProvider.prototype.set = function (key, item) {
        this.store[key] = item;
        return Promise.resolve();
    };
    InMemoryCacheProvider.prototype.remove = function (key) {
        if (this.store[key]) {
            delete this.store[key];
        }
        return Promise.resolve();
    };
    InMemoryCacheProvider.prototype.clear = function () {
        this.store = {};
        return Promise.resolve();
    };
    return InMemoryCacheProvider;
}());
export { InMemoryCacheProvider };
//# sourceMappingURL=in-memory.provider.js.map