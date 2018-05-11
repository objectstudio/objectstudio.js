import { NgModule } from '@angular/core';
import { CacheService } from './cache/cache.service';
import { LogService } from './logging/log.service';
import { AlertsService } from './alerts/alerts.service';
import { Core } from './core';

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
export class FrameworkModule { }
