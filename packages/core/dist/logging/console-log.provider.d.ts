import { ILogProvider } from "./log.service";
/**
 * A console log implementation for the logging service.
 */
export declare class ConsoleLogProvider implements ILogProvider {
    constructor();
    write(level: string, args: any[]): void;
}
