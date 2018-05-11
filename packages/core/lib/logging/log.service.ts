import { Injectable } from "@angular/core";
import { ConsoleLogProvider } from "./console-log.provider";

@Injectable()
export class LogService
{
     providers: ILogProvider[] = [];

     register(provider: ILogProvider)
     {
          this.providers.push(provider);
     }

     registerConsole()
     {
          this.providers.push(new ConsoleLogProvider());
     }

     private write(level, args: any[]): void
     {
          this.providers.forEach((provider) =>
          {
               try
               {
                    // write to provider
                    provider.write(level, args);
               }
               catch (error)
               {
                    // do nothing - as even our logging is breaking...
               }
          });
     }

     public assert(...args: any[]): void
     {
          this.write('assert', args);
     }

     public error(...args: any[]): void
     {
          this.write('error', args);

     }

     public group(...args: any[]): void
     {
          this.write('group', args);
     }

     public groupEnd(...args: any[]): void
     {
          this.write('groupEnd', args);
     }

     public debug(...args: any[]): void
     {
          this.write('debug', args);
     }

     public info(...args: any[]): void
     {
          this.write('info', args);
     }

     public log(...args: any[]): void
     {
          this.write('log', args);
     }

     public warn(...args: any[]): void
     {
          this.write('warn', args);
     }
}

// Define the interface that all loggers must implement.
export interface ILogProvider
{
     write(level: string, args: any[]): void;
}
