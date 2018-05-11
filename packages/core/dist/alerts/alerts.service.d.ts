import { Subject } from "rxjs/Subject";
import { LogService } from "../logging/log.service";
export declare class AlertsService {
    private log;
    alertOccured: Subject<Alert>;
    loggingEnabled: boolean;
    alerts: Array<Alert>;
    constructor(log: LogService);
    error(code: string, message: string, details?: Array<string>): Alert;
    warn(message: string): Alert;
    success(message: string): Alert;
    private push(level, code, message, details);
    private logAlert(alert);
    hasAny(): boolean;
    dismiss(alert?: Alert): void;
}
export declare class Alert {
    level: AlertLevel;
    code: string;
    message: string;
    details: Array<string>;
}
export declare enum AlertLevel {
    Error = 0,
    Warn = 1,
    Success = 2,
}
