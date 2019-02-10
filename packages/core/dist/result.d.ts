export declare class Result {
    success: boolean;
    code: string;
    exception: any;
    messages: string[];
}
export declare class ResultOf<T> extends Result {
    value: T;
}
