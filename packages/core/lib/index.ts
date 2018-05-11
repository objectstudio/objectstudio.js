import { NgModule, Injectable } from '@angular/core';
import { CacheService } from './cache/cache.service';
import { LogService } from './logging/log.service';
import { AlertsService } from './alerts/alerts.service';

/*
=========================================
= Define Service for convenient access
=========================================
*/

@Injectable()
export class Core
{
	constructor(public log: LogService,
		public cache: CacheService,
		public alerts: AlertsService)
	{

	}
}

/*
=========================================
= Define Angular Module
=========================================
*/

@NgModule({
     declarations: [

     ],
     imports: [

     ],
     entryComponents: [

     ],
     providers: [
          Core,
          LogService,
          CacheService,
          AlertsService
     ]
})
export class CoreModule { }

/*
=========================================
= Export Full Library API to package consumers
=========================================
*/

export * from './alerts';
export * from './cache';
export * from './logging';
