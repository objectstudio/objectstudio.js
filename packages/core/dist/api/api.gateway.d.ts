import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { LogService } from "../logging";
import { Result, ResultOf } from "../result";
export declare class ApiGatewayConfiguration {
    /**
     * The api domain (with protocol and port)
     */
    domain: string;
    /**
     * The Http status code for an operational failure. Meaning that the
     * response should be parsed as a result.
     */
    failureStatusCode: number;
    /**
     * A global handler for all unsuccessful results.
     */
    onFail: (failure: Result, response: HttpResponse<any>) => void;
    /**
     * A global handler for all http failures.
     */
    onError: (response: HttpResponse<any>) => void;
}
export declare class ApiGateway {
    http: HttpClient;
    private log;
    configuration: ApiGatewayConfiguration;
    private activeRequests;
    private authHeaderName;
    private authToken;
    /**
     * True if the gateway is actively procesing requests.
     */
    readonly isActive: boolean;
    /**
     * The current authentication token.
     */
    readonly authenticationToken: string;
    /**
      * Constructor
      */
    constructor(http: HttpClient, log: LogService);
    /**
     * Initialize the gateway.
     */
    init(configuration: ApiGatewayConfiguration): void;
    /**
     * Set the authentication token.
     * @param token
     * @param headerName
     */
    setAuthentication(token: string, headerName?: string): void;
    /**
     * Clears the authentication token.
     */
    resetAuthentication(): void;
    /**
     * Execute a GET request (with JSON response).
     */
    get<T>(path: string, params?: HttpParams, headers?: HttpHeaders): Promise<ResultOf<T>>;
    /**
     * Execute a POST request (with JSON response).
     */
    postOf<T>(path: string, body?: any, params?: HttpParams, headers?: HttpHeaders): Promise<ResultOf<T>>;
    /**
     * Execute a POST request (with JSON response).
     */
    post(path: string, body?: any, params?: HttpParams, headers?: HttpHeaders): Promise<Result>;
    private preparePath;
    private prepareBody;
    private prepareHeaders;
    private processHttpError;
}
