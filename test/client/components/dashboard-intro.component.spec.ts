import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { FlexLayoutModule } from '@angular/flex-layout';

/*
*	Some material components rely on hammerjs
*	CustomMaterialModule loads exact material modules
*/
import '../../../node_modules/hammerjs/hammer.js';
import { CustomMaterialModule } from '../../../public/app/modules/custom-material.module';

import { NvD3Component } from 'ng2-nvd3';

import { EventEmitterService } from '../../../public/app/services/event-emitter.service';
import { CustomDeferredService } from '../../../public/app/services/custom-deferred.service';
import { CustomHttpHandlersService } from '../../../public/app/services/custom-http-handlers.service';

import { TranslateService, TranslatePipe, TRANSLATION_PROVIDERS } from '../../../public/app/translate/index';

import { ServerStaticDataService } from '../../../public/app/services/server-static-data.service';
import { PublicDataService } from '../../../public/app/services/public-data.service';

import { DashboardIntroComponent } from '../../../public/app/components/dashboard-intro.component';

describe('DashboardIntroComponent', () => {

	beforeEach((done) => {
		TestBed.configureTestingModule({
			declarations: [ TranslatePipe, NvD3Component, DashboardIntroComponent, NvD3Component ],
			imports: [ BrowserDynamicTestingModule, NoopAnimationsModule, FlexLayoutModule, CustomMaterialModule, HttpClientTestingModule ],
			providers: [
				{ provide: 'Window', useValue: { location: { host: 'localhost', protocol: 'http' } } },
				EventEmitterService,
				TRANSLATION_PROVIDERS,
				TranslateService,
				{
					provide: CustomHttpHandlersService,
					useFactory: () => new CustomHttpHandlersService()
				},
				{
					provide: PublicDataService,
					useFactory: (http, handlers, window) => new PublicDataService(http, handlers, window),
					deps: [HttpClient, CustomHttpHandlersService, 'Window']
				},
				{
					provide: ServerStaticDataService,
					useFactory: (http, handlers, window) => new ServerStaticDataService(http, handlers, window),
					deps: [HttpClient, CustomHttpHandlersService, 'Window']
				}
			],
			schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
		}).compileComponents().then(() => {
			this.fixture = TestBed.createComponent(DashboardIntroComponent);
			this.component = this.fixture.componentInstance;
			this.serverStaticDataSrv = TestBed.get(ServerStaticDataService) as ServerStaticDataService;
			this.publicDataSrv = TestBed.get(PublicDataService) as PublicDataService;
			this.httpController = TestBed.get(HttpTestingController) as HttpTestingController;
			done();
		});
	});

	afterEach(() => {
		this.httpController.match((req: HttpRequest<any>): boolean => true).forEach((req: TestRequest) => req.flush({}));
		this.httpController.verify();
	});

	it('should be defined', () => {
		expect(this.component).toBeDefined();
	});

	it('should have variables defined', () => {
		expect(this.component.subscriptions).toEqual(jasmine.any(Array));
		expect(this.component.title).toBeDefined();
		expect(this.component.title === 'Ng2NodeMongoCore (N2NMC)').toBeTruthy();
		expect(this.component.description).toBeDefined();
		expect(this.component.description === 'Angular, NodeJS, MongoDB').toBeTruthy();
		expect(this.component.chartOptions).toEqual(jasmine.any(Object));
		expect(this.component.chartOptions.chart).toBeDefined();
		expect(this.component.chartOptions.chart).toEqual({
			type: jasmine.any(String),
			height: jasmine.any(Number),
			donut: jasmine.any(Boolean),
			x: jasmine.any(Function),
			y: jasmine.any(Function),
			showLabels: jasmine.any(Boolean),
			labelSunbeamLayout: jasmine.any(Boolean),
			pie: {
				startAngle: jasmine.any(Function),
				endAngle: jasmine.any(Function)
			},
			duration: jasmine.any(Number),
			title: jasmine.any(String),
			legend: {
				margin: {
					top: jasmine.any(Number),
					right: jasmine.any(Number),
					bottom: jasmine.any(Number),
					left: jasmine.any(Number)
				}
			}
		});
		expect(this.component.appUsageData).toEqual(jasmine.any(Array));
		expect(this.component.serverData).toEqual({
			static: jasmine.any(Array),
			dynamic: jasmine.any(Array)
		});
		expect(this.component.host).toBeDefined();
		expect(this.component.host).toEqual(window.location.host);
		expect(this.component.wsUrl).toEqual('ws://'+this.component.host+'/api/app-diag/dynamic');
		expect(this.component.ws).toEqual(jasmine.any(WebSocket));
		expect(this.component.getServerStaticData).toBeDefined();
		expect(this.component.getPublicData).toBeDefined();
		expect(this.component.nvd3).toEqual(jasmine.any(NvD3Component));
		expect(this.component.ngOnInit).toBeDefined();
		expect(this.component.ngOnDestroy).toBeDefined();
	});

	it('should be properly destroyed', () => {
		this.component.ngOnInit();
		for (const sub of this.component.subscriptions) {
			spyOn(sub, 'unsubscribe').and.callThrough();
		}
		this.httpController.match((req: HttpRequest<any>): boolean => true).forEach((req: TestRequest) => req.flush({}));
		this.component.ngOnDestroy();
		for (const sub of this.component.subscriptions) {
			expect(sub.unsubscribe).toHaveBeenCalled();
		}
	});

});

