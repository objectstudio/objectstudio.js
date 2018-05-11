var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
import { v4 as uuid } from 'uuid';
import { LogService } from "../logging/log.service";
import { InMemoryCacheProvider } from "./in-memory.provider";
// consider "area" support (allowing different caches for different types of data)
// create a local storage and file storage provider
var CacheService = /** @class */ (function () {
    /**
     * Constructor
     */
    function CacheService(log) {
        this.log = log;
        this.store = null;
        this.sessionID = null;
        this.userID = null;
        this.store = new InMemoryCacheProvider();
    }
    CacheService_1 = CacheService;
    /**
     * Set the Session ID and perform startup logic.
     * @param sessionID
     * @param purgeStaleSessionItems
     * @param store
     */
    CacheService.prototype.init = function (options, store) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // create a default session if none is supplied
            if (!options)
                options = new CacheInitializationOptions();
            if (!options.sessionID)
                options.sessionID = CacheService_1.createSessionID();
            _this.log.info("Initializing Cache (Session: " + options.sessionID + ")...");
            _this.sessionID = options.sessionID;
            if (store) {
                _this.store = store;
            }
            else {
                store = _this.store;
            }
            _this.log.info("Initializing Cache Provider...");
            // init the provider
            store.init(options).then(function () {
                // then validate each item
                _this.processNewSession(options.purgeStaleSessionItems).then(function () {
                    _this.log.info("Provider Initialized.");
                    resolve();
                }, reject);
            }, function (reason) {
                // log issue
                _this.log.error("Unable to initialize cache.", reason);
                // notify callers
                reject(reason);
            });
        });
    };
    /**
     * Perform operations on start of a new session.
     * @param purgeStaleSessionItems
     */
    CacheService.prototype.processNewSession = function (purgeStaleSessionItems) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // ensure all items are valid for the current user
            _this.getAll().then(function (all) {
                for (var _i = 0, all_1 = all; _i < all_1.length; _i++) {
                    var item = all_1[_i];
                    var stale = false;
                    // if not associated to current session, mark stale
                    if (_this.sessionID && item.sessionID && item.sessionID != _this.sessionID) {
                        stale = true;
                    }
                    // if no session and has session id, mark stale
                    else if (!_this.sessionID && item.sessionID) {
                        stale = true;
                    }
                    // if stale, take approriate policy action
                    if (stale) {
                        if (item.policy == CachePolicy.SessionOnly) {
                            _this.log.debug("Removing Cache Item (" + item.key + ", " + item.policy + ")");
                            _this.store.remove(item.key);
                        }
                        else if (item.policy == CachePolicy.Session && purgeStaleSessionItems) {
                            _this.log.debug("Removing Cache item (" + item.key + ", " + item.policy + ")");
                            _this.store.remove(item.key);
                        }
                        else {
                            _this.log.debug("Marking Cache Item Stale (" + item.key + ", " + item.policy + ")");
                            item.stale = true;
                            _this.store.set(item.key, item);
                        }
                    }
                }
                // notify callers
                resolve();
            }, reject);
        });
    };
    /**
     * Get an item from the store.
     * @param key
     */
    CacheService.prototype.get = function (key) {
        return this.store.get(key);
    };
    /**
     * Get all items in store.
     */
    CacheService.prototype.getAll = function (filter) {
        return this.store.getAll(filter);
    };
    /**
     * Get the value of item in the store.
     * @param key Null if not in the store.
     */
    CacheService.prototype.getValue = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.get(key).then(function (item) {
                resolve(CacheService_1.getValueAs(item, null));
            }, reject);
        });
    };
    /**
     * Get the value as a specified type.
     * @param key
     * @param defaultValue
     */
    CacheService.prototype.getValueAs = function (key, defaultValue) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.get(key).then(function (item) {
                resolve(CacheService_1.getValueAs(item, defaultValue));
            }, reject);
        });
    };
    /**
     * Set the item in to the store with the specified cache behavior.
     * @param key
     * @param policy
     * @param value
     */
    CacheService.prototype.set = function (key, policy, value) {
        var _this = this;
        var item = new CacheItem();
        item.key = key;
        item.policy = policy;
        item.stale = false;
        item.dirty = false;
        item.value = value;
        item.cachedOn = new Date();
        if (policy == CachePolicy.Session)
            item.sessionID = this.sessionID;
        if (policy == CachePolicy.SessionOnly)
            item.sessionID = this.sessionID;
        if (policy == CachePolicy.User) {
            item.userID = this.userID;
            item.sessionID = this.sessionID;
        }
        this.log.debug("Caching Item (" + item.key + ", " + item.policy + ")");
        return new Promise(function (resolve, reject) {
            _this.store.set(key, item).then(function () {
                resolve(item);
            }, reject);
        });
    };
    /**
     * Set an item for the current session (will be available but stale on subsequent sessions).
     * @param key
     * @param value
     */
    CacheService.prototype.setForSession = function (key, value) {
        return this.set(key, CachePolicy.Session, value);
    };
    /**
     * Set an item for the current session only (will not be avialble on subsequent sessions).
     * @param key
     * @param value
     */
    CacheService.prototype.setForSessionOnly = function (key, value) {
        return this.set(key, CachePolicy.SessionOnly, value);
    };
    /**
     * Set an item for the current the current user only.
     * @param key
     * @param value
     */
    CacheService.prototype.setForUser = function (key, value) {
        return this.set(key, CachePolicy.User, value);
    };
    /**
     * Set an item permanently.
     * @param key
     * @param value
     */
    CacheService.prototype.setPermanently = function (key, value) {
        return this.set(key, CachePolicy.Permanent, value);
    };
    /**
     * Remove the specified item from the store.
     * @param key
     */
    CacheService.prototype.remove = function (key) {
        return this.store.remove(key);
    };
    /**
     * Remove all items from the store.
     */
    CacheService.prototype.removeAll = function () {
        return this.store.clear();
    };
    /**
     * Mark an item dirty.
     * @param key
     */
    CacheService.prototype.markDirty = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.store.get(key).then(function (item) {
                if (item) {
                    item.dirty = true;
                    _this.store.set(key, item).then(resolve, reject);
                }
                resolve();
            }, function (reason) {
                reject(reason);
            });
        });
    };
    /**
     * Mark an item stale.
     * @param key
     */
    CacheService.prototype.markStale = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.store.get(key).then(function (item) {
                if (item) {
                    item.stale = true;
                    _this.store.set(key, item).then(resolve, reject);
                }
                resolve();
            }, reject);
        });
    };
    ;
    /**
     *
     * @param userID
     */
    CacheService.prototype.setUser = function (userID) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.userID = userID;
            // ensure all items are valid for the current user
            _this.getAll().then(function (all) {
                var operations = [];
                for (var _i = 0, all_2 = all; _i < all_2.length; _i++) {
                    var item = all_2[_i];
                    // if not associated to current user, remove
                    if (_this.userID && item.userID && item.userID != _this.userID) {
                        _this.log.debug("Removing Cache Item (" + item.key + ", " + item.policy + ")");
                        operations.push(_this.store.remove(item.key));
                    }
                    // if no current user and has user, remove
                    else if (!_this.userID && item.userID) {
                        _this.log.debug("Removing Cache Item (" + item.key + ", " + item.policy + ")");
                        operations.push(_this.store.remove(item.key));
                    }
                }
                // notify callers
                Promise.all(operations).then(function () { resolve(); }, reject);
            }, reject);
        });
    };
    /**
     * True if an item is valid (not stale or dirty)
     * @param key
     */
    CacheService.prototype.isValid = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.get(key).then(function (item) {
                resolve(CacheService_1.isValid(item));
            }, reject);
        });
    };
    /**
     * Get the value as a specified type.
     */
    CacheService.getValueAs = function (item, defaultValue) {
        if (item && item.value != null)
            return item.value;
        return defaultValue;
    };
    /**
     * True if the itme is valid.
     * @param item
     */
    CacheService.isValid = function (item) {
        if (!item)
            return false;
        if (item.stale)
            return false;
        if (item.dirty)
            return false;
        return true;
    };
    /**
     * True if the cache item is value and not null.
     * @param item
     */
    CacheService.isValidAndNotNull = function (item) {
        return CacheService_1.isValid(item) && item.value != null;
    };
    /**
     * Create a Unique ID (GUID) for use as a session key.
     */
    CacheService.createSessionID = function () {
        return uuid();
    };
    CacheService = CacheService_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [LogService])
    ], CacheService);
    return CacheService;
    var CacheService_1;
}());
export { CacheService };
var CacheInitializationOptions = /** @class */ (function () {
    function CacheInitializationOptions() {
        this.purgeStaleSessionItems = false;
    }
    return CacheInitializationOptions;
}());
export { CacheInitializationOptions };
var CacheItem = /** @class */ (function () {
    function CacheItem() {
    }
    return CacheItem;
}());
export { CacheItem };
export var CachePolicy;
(function (CachePolicy) {
    CachePolicy[CachePolicy["None"] = 0] = "None";
    CachePolicy[CachePolicy["Session"] = 1] = "Session";
    CachePolicy[CachePolicy["User"] = 2] = "User";
    CachePolicy[CachePolicy["SessionOnly"] = 3] = "SessionOnly";
    CachePolicy[CachePolicy["Permanent"] = 4] = "Permanent";
})(CachePolicy || (CachePolicy = {}));
//# sourceMappingURL=cache.service.js.map