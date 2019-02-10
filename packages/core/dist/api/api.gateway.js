var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, publishLast, refCount } from "rxjs/operators";
import { LogService } from "../logging";
import { Result, ResultOf } from "../result";
var ApiGatewayConfiguration = /** @class */ (function () {
    function ApiGatewayConfiguration() {
        /**
         * The Http status code for an operational failure. Meaning that the
         * response should be parsed as a result.
         */
        this.failureStatusCode = 422;
    }
    ApiGatewayConfiguration = __decorate([
        Injectable()
    ], ApiGatewayConfiguration);
    return ApiGatewayConfiguration;
}());
export { ApiGatewayConfiguration };
var ApiGateway = /** @class */ (function () {
    /**
      * Constructor
      */
    function ApiGateway(http, log) {
        this.http = http;
        this.log = log;
        this.activeRequests = 0;
        this.authHeaderName = 'Authorization';
    }
    Object.defineProperty(ApiGateway.prototype, "isActive", {
        /**
         * True if the gateway is actively procesing requests.
         */
        get: function () {
            if (this.activeRequests > 0)
                return true;
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApiGateway.prototype, "authenticationToken", {
        /**
         * The current authentication token.
         */
        get: function () {
            return this.authToken;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initialize the gateway.
     */
    ApiGateway.prototype.init = function (configuration) {
        this.configuration = configuration;
    };
    /**
     * Set the authentication token.
     * @param token
     * @param headerName
     */
    ApiGateway.prototype.setAuthentication = function (token, headerName) {
        this.authToken = token;
        if (headerName) {
            this.authHeaderName = headerName;
        }
    };
    /**
     * Clears the authentication token.
     */
    ApiGateway.prototype.resetAuthentication = function () {
        this.authToken = null;
    };
    /**
     * Execute a GET request (with JSON response).
     */
    ApiGateway.prototype.get = function (path, params, headers) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    this.activeRequests++;
                    return [2 /*return*/, (this.http.get(this.preparePath(path), {
                            headers: this.prepareHeaders(headers),
                            params: params,
                            responseType: 'json',
                            withCredentials: true
                        }).pipe(catchError(function (error) { return _this.processHttpError(error, _this.configuration); }), publishLast(), refCount())
                            .toPromise()
                            .then(function (result) {
                            _this.activeRequests--;
                            return result;
                        })
                            .catch(function (result) {
                            _this.activeRequests--;
                            return result;
                        }))];
                }
                catch (error) {
                    this.log.error('HTTP_CALL_ERROR]', error);
                    result = new ResultOf();
                    result.code = error.code ? error.code : 'HTTP_CALL_ERROR';
                    result.messages = [error.message];
                    return [2 /*return*/, result];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Execute a POST request (with JSON response).
     */
    ApiGateway.prototype.postOf = function (path, body, params, headers) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    this.activeRequests++;
                    return [2 /*return*/, (this.http.post(this.preparePath(path), this.prepareBody(body), {
                            headers: this.prepareHeaders(headers, body),
                            params: params,
                            responseType: 'json',
                            withCredentials: true
                        }).pipe(catchError(function (error) { return _this.processHttpError(error, _this.configuration); }), publishLast(), refCount())
                            .toPromise()
                            .then(function (result) {
                            _this.activeRequests--;
                            return result;
                        })
                            .catch(function (result) {
                            _this.activeRequests--;
                            return result;
                        }))];
                }
                catch (error) {
                    this.log.error('HTTP_CALL_ERROR]', error);
                    result = new ResultOf();
                    result.code = error.code ? error.code : 'HTTP_CALL_ERROR';
                    result.messages = [error.message];
                    return [2 /*return*/, result];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Execute a POST request (with JSON response).
     */
    ApiGateway.prototype.post = function (path, body, params, headers) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    this.activeRequests++;
                    return [2 /*return*/, (this.http.post(this.preparePath(path), this.prepareBody(body), {
                            headers: this.prepareHeaders(headers, body),
                            params: params,
                            responseType: 'json',
                            withCredentials: true
                        }).pipe(catchError(function (error) { return _this.processHttpError(error, _this.configuration); }), publishLast(), refCount())
                            .toPromise()
                            .then(function (result) {
                            _this.activeRequests--;
                            return result;
                        })
                            .catch(function (result) {
                            _this.activeRequests--;
                            return result;
                        }))];
                }
                catch (error) {
                    this.log.error('HTTP_CALL_ERROR]', error);
                    result = new Result();
                    result.code = error.code ? error.code : 'HTTP_CALL_ERROR';
                    result.messages = [error.message];
                    return [2 /*return*/, result];
                }
                return [2 /*return*/];
            });
        });
    };
    ApiGateway.prototype.preparePath = function (path) {
        // ensure a domain is attached
        if (path && !path.startsWith('http')) {
            path = this.configuration.domain + path;
        }
        return path;
    };
    ApiGateway.prototype.prepareBody = function (body) {
        if (body) {
            return JSON.stringify(body);
        }
        return body;
    };
    ApiGateway.prototype.prepareHeaders = function (headers, body) {
        // copy all headers to a new object
        // (a bug in angular prevents just updating the headers as one would anticipate being able to do)
        var prepared = {};
        // copy anything defined in headers
        if (headers) {
            for (var _i = 0, _a = headers.keys(); _i < _a.length; _i++) {
                var key = _a[_i];
                prepared[key] = headers.get(key);
            }
        }
        // set the content type if not specified
        if (body) {
            // set the content type
            if (!headers || !headers.has('Content-Type')) {
                prepared['Content-Type'] = ['application/json'];
            }
        }
        // set the auth token
        if (this.authToken) {
            if (!headers || !headers.has(this.authHeaderName)) {
                prepared[this.authHeaderName] = this.authToken;
            }
        }
        return prepared;
    };
    ApiGateway.prototype.processHttpError = function (error, configuration) {
        // handle "operation" errors identify during handleHttpSuccess
        if (error.status == configuration.failureStatusCode && error.error) {
            var result = void 0;
            if (typeof error.error == "string") {
                result = JSON.parse(error.error);
            }
            else {
                result = error.error;
            }
            return throwError(result);
        }
        // else handle the http errors (authentication)
        else if (error.status == 401) {
            console.error("HTTP_ERROR: Status code " + error.status + " on url " + error.url);
            var message = {
                code: "AUTHENTICATION_ERROR",
                messages: ["You must be logged in to use the requested feature."]
            };
            return throwError(message);
        }
        // else handle the http errors  (permissions)
        else if (error.status == 403) {
            this.log.error("HTTP_ERROR: Status code " + error.status + " on url " + error.url);
            var message = {
                code: "PERMISSION_ERROR",
                messages: ["You don't have access to the requested feature."]
            };
            return throwError(message);
        }
        // else handle the http errors (other http)
        else if (error.status) {
            this.log.error("HTTP_ERROR: Status code " + error.status + " on url " + error.url);
            var message = {
                code: "UNEXPECTED_ERROR",
                messages: ["An unexpected system error occured."]
            };
            return throwError(message);
        }
        // else handle any other errors errors
        else {
            this.log.error("ERROR: A non-HTTP error occurred: " + error.toString());
            var message = {
                code: "UNEXPECTED_ERROR",
                messages: ["An unexpected system error occured."]
            };
            return throwError(message);
        }
    };
    ApiGateway = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient,
            LogService])
    ], ApiGateway);
    return ApiGateway;
}());
export { ApiGateway };
//# sourceMappingURL=api.gateway.js.map