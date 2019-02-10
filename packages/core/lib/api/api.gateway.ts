import { Injectable } from "@angular/core";
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from "@angular/common/http";

import { throwError } from "rxjs";
import { catchError, map, publishLast, refCount, tap } from "rxjs/operators";

import { LogService } from "../logging";
import { Result, ResultOf } from "../result";

@Injectable()
export class ApiGatewayConfiguration {

    /**
     * The api domain (with protocol and port)
     */
    domain: string;

    /**
     * The Http status code for an operational failure. Meaning that the
     * response should be parsed as a result.
     */
    failureStatusCode: number = 422;

    /**
     * A global handler for all unsuccessful results.
     */
    onFail: (failure: Result, response: HttpResponse<any>) => void;

    /**
     * A global handler for all http failures.
     */
    onError: (response: HttpResponse<any>) => void;
}

@Injectable()
export class ApiGateway {

    configuration: ApiGatewayConfiguration;

    private activeRequests: number = 0;

    private authHeaderName: string = 'Authorization';

    private authToken: string;

    /**
     * True if the gateway is actively procesing requests.
     */
    get isActive(): boolean {
        if (this.activeRequests > 0) return true;
        return false;
    }

    /**
     * The current authentication token.
     */
    get authenticationToken(): string {
        return this.authToken;
    }

    /**
      * Constructor
      */
    constructor(public http: HttpClient,
        private log: LogService) {
    }

    /**
     * Initialize the gateway.
     */
    init(configuration: ApiGatewayConfiguration) {
        this.configuration = configuration;
    }

    /**
     * Set the authentication token.
     * @param token
     * @param headerName 
     */
    setAuthentication(token: string, headerName?: string) {
        this.authToken = token;
        if (headerName) {
            this.authHeaderName = headerName;
        }
    }

    /**
     * Clears the authentication token.
     */
    resetAuthentication() {
        this.authToken = null;
    }

    /**
     * Execute a GET request (with JSON response).
     */
    async get<T>(path: string,
        params?: HttpParams,
        headers?: HttpHeaders): Promise<ResultOf<T>> {

        try {

            this.activeRequests++;
            return <Promise<ResultOf<T>>>(this.http.get<ResultOf<T>>(this.preparePath(path),
                {
                    headers: this.prepareHeaders(headers),
                    params: params,
                    responseType: 'json',
                    withCredentials: true
                }).pipe(
                    catchError((error) => this.processHttpError(error, this.configuration)),
                    publishLast(),
                    refCount())
                .toPromise()
                .then((result: ResultOf<T>) => {
                    this.activeRequests--;
                    return result;
                })
                .catch((result: ResultOf<T>) => {
                    this.activeRequests--;
                    return result;
                }));
        }
        catch (error) {
            this.log.error('HTTP_CALL_ERROR]', error);

            const result = new ResultOf<T>();
            result.code = error.code ? error.code : 'HTTP_CALL_ERROR';
            result.messages = [error.message];
            return result;
        }
    }

    /**
     * Execute a POST request (with JSON response).
     */
    async postOf<T>(path: string,
        body?: any,
        params?: HttpParams,
        headers?: HttpHeaders): Promise<ResultOf<T>> {

        try {

            this.activeRequests++;
            return <Promise<ResultOf<T>>>(this.http.post<ResultOf<T>>(this.preparePath(path),
                this.prepareBody(body),
                {
                    headers: this.prepareHeaders(headers, body),
                    params: params,
                    responseType: 'json',
                    withCredentials: true
                }).pipe(
                    catchError((error) => this.processHttpError(error, this.configuration)),
                    publishLast(),
                    refCount())
                .toPromise()
                .then((result: ResultOf<T>) => {
                    this.activeRequests--;
                    return result;
                })
                .catch((result: ResultOf<T>) => {
                    this.activeRequests--;
                    return result;
                }));
        }
        catch (error) {
            this.log.error('HTTP_CALL_ERROR]', error);

            const result = new ResultOf<T>();
            result.code = error.code ? error.code : 'HTTP_CALL_ERROR';
            result.messages = [error.message];
            return result;
        }
    }

    /**
     * Execute a POST request (with JSON response).
     */
    async post(path: string,
        body?: any,
        params?: HttpParams,
        headers?: HttpHeaders): Promise<Result> {

        try {

            this.activeRequests++;
            return <Promise<Result>>(this.http.post<Result>(this.preparePath(path),
                this.prepareBody(body),
                {
                    headers: this.prepareHeaders(headers, body),
                    params: params,
                    responseType: 'json',
                    withCredentials: true
                }).pipe(
                    catchError((error) => this.processHttpError(error, this.configuration)),
                    publishLast(),
                    refCount())
                .toPromise()
                .then((result: Result) => {
                    this.activeRequests--;
                    return result;
                })
                .catch((result: Result) => {
                    this.activeRequests--;
                    return result;
                }));
        }
        catch (error) {
            this.log.error('HTTP_CALL_ERROR]', error);

            const result = new Result();
            result.code = error.code ? error.code : 'HTTP_CALL_ERROR';
            result.messages = [error.message];
            return result;
        }
    }

    private preparePath(path: string): string {
        // ensure a domain is attached
        if (path && !path.startsWith('http')) {
            path = this.configuration.domain + path;
        }
        return path;
    }

    private prepareBody(body?: any): any {
        if (body) {
            return JSON.stringify(body);
        }
        return body;
    }

    private prepareHeaders(headers?: HttpHeaders, body?: any): { [header: string]: string | string[] } {

        // copy all headers to a new object
        // (a bug in angular prevents just updating the headers as one would anticipate being able to do)

        let prepared: { [header: string]: string | string[] } = {};

        // copy anything defined in headers
        if (headers) {
            for (let key of headers.keys())
            {
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
    }

    private processHttpError(error: any, configuration: ApiGatewayConfiguration) {
        // handle "operation" errors identify during handleHttpSuccess
        if (error.status == configuration.failureStatusCode && error.error) {

            let result: Result;

            if (typeof error.error == "string") {
                result = <Result>JSON.parse(error.error);
            }
            else {
                result = <Result>error.error;
            }

            return throwError(result);
        }

        // else handle the http errors (authentication)
        else if (error.status == 401) {

            console.error(`HTTP_ERROR: Status code ${error.status} on url ${error.url}`);

            let message = {
                code: "AUTHENTICATION_ERROR",
                messages: ["You must be logged in to use the requested feature."]
            };
            return throwError(message);
        }

        // else handle the http errors  (permissions)
        else if (error.status == 403) {

            this.log.error(`HTTP_ERROR: Status code ${error.status} on url ${error.url}`);

            let message = {
                code: "PERMISSION_ERROR",
                messages: ["You don't have access to the requested feature."]
            };
            return throwError(message);
        }

        // else handle the http errors (other http)
        else if (error.status) {

            this.log.error(`HTTP_ERROR: Status code ${error.status} on url ${error.url}`);

            let message = {
                code: "UNEXPECTED_ERROR",
                messages: ["An unexpected system error occured."]
            };
            return throwError(message);
        }

        // else handle any other errors errors
        else {

            this.log.error(`ERROR: A non-HTTP error occurred: ${error.toString()}`);

            let message = {
                code: "UNEXPECTED_ERROR",
                messages: ["An unexpected system error occured."]
            };
            return throwError(message);
        }
    }
}