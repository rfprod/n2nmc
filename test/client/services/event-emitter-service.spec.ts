import { TestBed } from '@angular/core/testing';

import { EventEmitterService } from '../../../public/app/services/event-emitter.service';

describe('EventEmitterService', () => {

	beforeEach((done) => {
		TestBed.configureTestingModule({
			declarations: [],
			imports: [],
			providers: [
				{ provide: 'Window', useValue: window },
				EventEmitterService
			],
			schemas: []
		}).compileComponents().then(() => {
			this.service = TestBed.get(EventEmitterService) as EventEmitterService;
			spyOn(this.service.emitter, 'emit').and.callThrough();
			done();
		});
	});

	it('should be defined', () => {
		expect(this.service).toBeDefined();
	});

	it('should have variables and methods defined', () => {
		expect(this.service.emitter).toBeDefined();
		expect(this.service.emitEvent).toEqual(jasmine.any(Function));
    expect(this.service.getEmitter).toEqual(jasmine.any(Function));
    expect(this.service.emitSpinnerStartEvent).toEqual(jasmine.any(Function));
    expect(this.service.emitSpinnerStopEvent).toEqual(jasmine.any(Function));
	});

	it('getEmitter should return emitter', () => {
		expect(this.service.getEmitter()).toEqual(this.service.emitter);
	});

	it('emitSpinnerStartEvent should send respective event emitter message', () => {
		this.service.emitSpinnerStartEvent();
		expect(this.service.emitter.emit).toHaveBeenCalledWith({ spinner: 'start' });
	});

	it('emitSpinnerStopEvent should send respective event emitter message', () => {
		this.service.emitSpinnerStopEvent();
		expect(this.service.emitter.emit).toHaveBeenCalledWith({ spinner: 'stop' });
	});

});
