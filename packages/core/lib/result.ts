export class Result {    
    success: boolean;
    code: string;
    exception: any;
    messages: string[];
}

export class ResultOf<T> extends Result {
    value: T;
}