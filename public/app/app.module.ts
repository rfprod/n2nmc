import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';

/*
*	Some material components rely on hammerjs
*	CustomMaterialModule loads exact material modules
*/
import '../../node_modules/hammerjs/hammer.js';
import { CustomMaterialModule } from './modules/custom-material.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { TranslateService, TranslateModule } from './translate/index';

import { AppComponent } from './app.component';
import { AppNavComponent } from './components/app-nav.component';
import { AppInfoComponent } from './components/app-info.component';
import { DashboardIntroComponent } from './components/dashboard-intro.component';
import { DashboardLoginComponent } from './components/dashboard-login.component';
import { DashboardDetailsComponent } from './components/dashboard-details.component';

import { CustomServiceWorkerService } from './services/custom-service-worker.service';
import { CustomDeferredService } from './services/custom-deferred.service';
import { CustomHttpHandlersService } from './services/custom-http-handlers.service';
import { EventEmitterService } from './services/event-emitter.service';
import { UserService } from './services/user.service';

import { UsersListService } from './services/users-list.service';
import { ServerStaticDataService } from './services/server-static-data.service';
import { PublicDataService } from './services/public-data.service';

import { NvD3Component } from 'ng2-nvd3';

@NgModule({
	declarations: [ AppComponent, AppNavComponent, AppInfoComponent, DashboardIntroComponent,
									DashboardLoginComponent, DashboardDetailsComponent, NvD3Component
								],
	imports 		: [ BrowserModule, BrowserAnimationsModule, FlexLayoutModule, CustomMaterialModule, FormsModule,
									ReactiveFormsModule, HttpClientModule, TranslateModule, AppRoutingModule
								],
	providers 	: [ {provide: APP_BASE_HREF, useValue: '/'}, {provide: LocationStrategy, useClass: PathLocationStrategy},
									{ provide: 'Window', useValue: window }, CustomServiceWorkerService, CustomDeferredService,
									CustomHttpHandlersService, EventEmitterService,
									UserService, UsersListService, ServerStaticDataService, PublicDataService
								],
	schemas 		: [ CUSTOM_ELEMENTS_SCHEMA ],
	bootstrap 	: [ AppComponent ],
})
export class AppModule {}
