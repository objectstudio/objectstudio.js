import { Subject } from 'rxjs';
import { LogService } from '../logging/log.service';
export declare class AlertsService {
    private log;
    onAlert: Subject<Alert>;
    loggingEnabled: boolean;
    alerts: Array<Alert>;
    constructor(log: LogService);
    error(code: string, message: string, details?: Array<string>): Alert;
    warn(message: string): Alert;
    success(message: string): Alert;
    private push;
    private logAlert;
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
    Error = "ERROR",
    Warn = "WARN",
    Success = "SUCCESS"
}
