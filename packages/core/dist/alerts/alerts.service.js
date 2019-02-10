var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LogService } from '../logging/log.service';
var AlertsService = /** @class */ (function () {
    function AlertsService(log) {
        this.log = log;
        this.onAlert = new Subject();
        this.loggingEnabled = true;
        this.alerts = [];
    }
    AlertsService.prototype.error = function (code, message, details) {
        // set the message to the code if no message is provided
        if (!message && code) {
            message = code;
        }
        return this.push(AlertLevel.Error, code, message, details);
    };
    AlertsService.prototype.warn = function (message) {
        return this.push(AlertLevel.Warn, 'WARNING', message, []);
    };
    AlertsService.prototype.success = function (message) {
        return this.push(AlertLevel.Success, 'SUCCESS', message, []);
    };
    AlertsService.prototype.push = function (level, code, message, details) {
        var alert = new Alert();
        alert.level = level;
        alert.code = code;
        alert.message = message;
        alert.details = details;
        // log the alert
        this.logAlert(alert);
        // add it to the alert stack
        this.alerts.push(alert);
        // raise the alert occured event.
        this.onAlert.next(alert);
        return alert;
    };
    AlertsService.prototype.logAlert = function (alert) {
        if (this.loggingEnabled) {
            var message = alert.level.toString() + "] " + alert.code + "] " + alert.message;
            if (alert.level === AlertLevel.Warn) {
                this.log.warn(message);
            }
            else if (alert.level === AlertLevel.Success) {
                this.log.info(message);
            }
            else {
                this.log.error(message);
            }
            if (alert.details && alert.details.length) {
                for (var _i = 0, _a = alert.details; _i < _a.length; _i++) {
                    var detail = _a[_i];
                    var detailMessage = alert.level.toString() + " DETAILS] " + detail;
                    if (alert.level === AlertLevel.Warn) {
                        this.log.warn(detailMessage);
                    }
                    else if (alert.level === AlertLevel.Success) {
                        this.log.info(detailMessage);
                    }
                    else {
                        this.log.error(detailMessage);
                    }
                }
            }
        }
    };
    AlertsService.prototype.hasAny = function () {
        if (this.alerts.length > 0) {
            return true;
        }
        return false;
    };
    AlertsService.prototype.dismiss = function (alert) {
        if (alert && this.alerts) {
            var index = this.alerts.indexOf(alert);
            if (index > -1) {
                this.alerts.splice(index, 1);
            }
        }
        else {
            this.alerts = new Array();
        }
    };
    AlertsService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [LogService])
    ], AlertsService);
    return AlertsService;
}());
export { AlertsService };
var Alert = /** @class */ (function () {
    function Alert() {
        this.level = AlertLevel.Error;
    }
    return Alert;
}());
export { Alert };
export var AlertLevel;
(function (AlertLevel) {
    AlertLevel["Error"] = "ERROR";
    AlertLevel["Warn"] = "WARN";
    AlertLevel["Success"] = "SUCCESS";
})(AlertLevel || (AlertLevel = {}));
//# sourceMappingURL=alerts.service.js.map