import { NgModule, Injectable } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { SecureStorage } from '@ionic-native/secure-storage';
import { CoreModule } from "@objecstudio.js/core";
import { SecureStorageCacheProvider } from './cache/secure-storage.provider';

/*
=========================================
= Define Angular Module
=========================================
*/

@NgModule({
	declarations: [

	],
	imports: [
		IonicStorageModule.forRoot(),

		CoreModule
	],
	entryComponents: [

	],
	providers: [

		// ionic
		IonicStorageModule,

		// ionic native
		SecureStorage
	]
})
export class MobileModule { }

/*
=========================================
= Export Full Library API to package consumers
=========================================
*/

export * from './cache';
