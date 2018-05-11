export declare class LogService {
    providers: ILogProvider[];
    register(provider: ILogProvider): void;
    registerConsole(): void;
    private write(level, args);
    assert(...args: any[]): void;
    error(...args: any[]): void;
    group(...args: any[]): void;
    groupEnd(...args: any[]): void;
    debug(...args: any[]): void;
    info(...args: any[]): void;
    log(...args: any[]): void;
    warn(...args: any[]): void;
}
export interface ILogProvider {
    write(level: string, args: any[]): void;
}
