var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { ConsoleLogProvider } from './console-log.provider';
var LogService = /** @class */ (function () {
    function LogService() {
        this.providers = [];
    }
    LogService.prototype.register = function (provider) {
        this.providers.push(provider);
    };
    LogService.prototype.registerConsole = function () {
        this.providers.push(new ConsoleLogProvider());
    };
    LogService.prototype.write = function (level, args) {
        this.providers.forEach(function (provider) {
            try {
                // write to provider
                provider.write(level, args);
            }
            catch (error) {
                // do nothing - as even our logging is breaking...
            }
        });
    };
    LogService.prototype.assert = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.write('assert', args);
    };
    LogService.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.write('error', args);
    };
    LogService.prototype.group = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.write('group', args);
    };
    LogService.prototype.groupEnd = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.write('groupEnd', args);
    };
    LogService.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.write('debug', args);
    };
    LogService.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.write('info', args);
    };
    LogService.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.write('log', args);
    };
    LogService.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.write('warn', args);
    };
    LogService = __decorate([
        Injectable()
    ], LogService);
    return LogService;
}());
export { LogService };
//# sourceMappingURL=log.service.js.map