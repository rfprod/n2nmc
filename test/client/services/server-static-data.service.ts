import { TestBed, async } from '@angular/core/testing';

import { HttpClient, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { CustomHttpHandlersService } from '../../../public/app/services/custom-http-handlers.service';

import { ServerStaticDataService } from '../../../public/app/services/server-static-data.service';

describe('ServerStaticDataService', () => {

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [],
			imports: [ HttpClientTestingModule ],
			providers: [
				{ provide: 'Window', useValue: window },
				{
					provide: CustomHttpHandlersService,
					useFactory: () => new CustomHttpHandlersService()
				},
				{
					provide: ServerStaticDataService,
					useFactory: (http, handlers, win) => new ServerStaticDataService(http, handlers, win),
					deps: [HttpClient, CustomHttpHandlersService, 'Window']
				}
			]
		}).compileComponents().then(() => {
			this.httpController = TestBed.get(HttpTestingController) as HttpTestingController;
			this.service = TestBed.get(ServerStaticDataService) as ServerStaticDataService;
		});
	});

	afterEach(() => {
		this.httpController.match((req: HttpRequest<any>): boolean => req.url === this.service.endpoint).forEach((req: TestRequest) => req.flush({}));
		this.httpController.verify();
	});

	it('should be defined', () => {
		expect(this.service).toBeDefined();
	});

	it('should have variables and methods defined', () => {
		expect(this.service.endpoint).toEqual(jasmine.any(String));
		expect(this.service.getData).toBeDefined();
	});

	it('getData should return server stats as an array of objects', async () => {
		const sampleData = [{name: 'stat 1', value: 'stat 1 value'}, {name: 'stat 2', value: 'stat 2 value'}];
		await this.service.getData().subscribe(
			(data) => {
				expect(data).toEqual(sampleData);
			},
			(error) => console.log('should not be triggered')
		);
		this.httpController.match((req: HttpRequest<any>): boolean => req.url === this.service.endpoint).forEach((req: TestRequest) => req.flush(sampleData));
	});

	it('getData should process errors correctly', async () => {
		await this.service.getData().subscribe(
			(data) => console.log('should not be triggered'),
			(error) => {
				expect(error).toEqual('Server error');
			}
		);
		this.httpController.match((req: HttpRequest<any>): boolean => req.url === this.service.endpoint).forEach((req: TestRequest) => req.error(new ErrorEvent('err')));
	});

});
