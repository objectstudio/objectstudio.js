// Declare the console as an ambient value so that TypeScript doesn't complain.
declare var console: any;

// Import the application components and services.
import { ILogProvider } from "./log.service";

/**
 * A console log implementation for the logging service.
 */
export class ConsoleLogProvider implements ILogProvider
{
     constructor()
     {

     }

     write(level: string, args: any[]) : void
     {
          if (console && console[level])
          {
               console[level](...args);
          }
     }     
}
