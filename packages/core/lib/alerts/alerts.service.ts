import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { LogService } from '../logging/log.service';


@Injectable()
export class AlertsService {
    onAlert: Subject<Alert> = new Subject<Alert>();

    loggingEnabled: boolean = true;

    alerts: Array<Alert> = [];

    constructor(private log: LogService) {

    }

    error(code: string, message: string, details?: Array<string>): Alert {
        // set the message to the code if no message is provided
        if (!message && code) { message = code; }

        return this.push(AlertLevel.Error, code, message, details);
    }

    warn(message: string): Alert {
        return this.push(AlertLevel.Warn, 'WARNING', message, []);
    }

    success(message: string): Alert {
        return this.push(AlertLevel.Success, 'SUCCESS', message, []);
    }

    private push(level: AlertLevel, code: string, message: string, details: Array<string>): Alert {
        const alert = new Alert();
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
    }

    private logAlert(alert: Alert) {
        if (this.loggingEnabled) {

            let message = `${alert.level.toString()}] ${alert.code}] ${alert.message}`;

            if (alert.level === AlertLevel.Warn) {
                this.log.warn(message);
            } else if (alert.level === AlertLevel.Success) {
                this.log.info(message);
            } else {
                this.log.error(message);
            }

            if (alert.details && alert.details.length) {
                for (const detail of alert.details) {

                    let detailMessage = `${alert.level.toString()} DETAILS] ${detail}`;

                    if (alert.level === AlertLevel.Warn) {
                        this.log.warn(detailMessage);
                    } else if (alert.level === AlertLevel.Success) {
                        this.log.info(detailMessage);
                    } else {
                        this.log.error(detailMessage);
                    }
                }
            }
        }
    }

    hasAny() {
        if (this.alerts.length > 0) { return true; }
        return false;
    }

    dismiss(alert?: Alert) {
        if (alert && this.alerts) {
            const index: number = this.alerts.indexOf(alert);
            if (index > -1) { this.alerts.splice(index, 1); }
        } else {
            this.alerts = new Array<Alert>();
        }
    }
}

export class Alert {
    level: AlertLevel = AlertLevel.Error;

    code: string;

    message: string;

    details: Array<string>;
}

export enum AlertLevel {

    Error = 'ERROR',

    Warn = 'WARN',

    Success = 'SUCCESS'
}
