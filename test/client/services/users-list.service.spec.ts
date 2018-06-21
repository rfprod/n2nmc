import { TestBed, async } from '@angular/core/testing';

import { HttpClient, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { CustomHttpHandlersService } from '../../../public/app/services/custom-http-handlers.service';

import { UsersListService } from '../../../public/app/services/users-list.service';

describe('UsersListService', () => {

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
					provide: UsersListService,
					useFactory: (http, handlers, win) => new UsersListService(http, handlers, win),
					deps: [HttpClient, CustomHttpHandlersService, 'Window']
				}
			]
		}).compileComponents().then(() => {
			this.httpController = TestBed.get(HttpTestingController) as HttpTestingController;
			this.service = TestBed.get(UsersListService) as UsersListService;
		});
	});

	afterEach(() => {
		this.httpController.match((req: HttpRequest<any>): boolean => true).forEach((req: TestRequest) => req.flush({}));
		this.httpController.verify();
	});

	it('should be defined', () => {
		expect(this.service).toBeDefined();
	});

	it('should have variables and methods defined', () => {
		expect(this.service.endpoint).toEqual(jasmine.any(String));
		expect(this.service.getUsersList).toBeDefined();
	});

	it('getUsersList should return array', async () => {
		const sampleData = [{name: 'stat 1', value: 'stat 1 value'}, {name: 'stat 2', value: 'stat 2 value'}];
		await this.service.getUsersList().subscribe(
			(data) => {
				expect(data).toEqual(sampleData);
			},
			(error) => console.log('should not be triggered')
		);
		this.httpController.expectOne(this.service.endpoint).flush(sampleData);
	});

	it('getUsersList should process errors correctly', async () => {
		await this.service.getUsersList().subscribe(
			(data) => console.log('should not be triggered'),
			(error) => {
				expect(error).toEqual('Server error');
			}
		);
		this.httpController.expectOne(this.service.endpoint).error(new ErrorEvent('err'));
	});

});
