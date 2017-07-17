import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { EventEmitterService } from '../services/event-emitter.service';
import { ServerStaticDataService } from '../services/server-static-data.service';
import { PublicDataService } from '../services/public-data.service';

declare let $: JQueryStatic;

@Component({
	selector: 'dashboard-login',
	templateUrl: '/public/app/views/dashboard-login.html',
})
export class DashboardLoginComponent implements OnInit, OnDestroy {
	constructor(
		public el: ElementRef,
		private emitter: EventEmitterService,
		private fb: FormBuilder,
		private serverStaticDataService: ServerStaticDataService,
		private publicDataService: PublicDataService
	) {
		console.log('this.el.nativeElement:', this.el.nativeElement);
		this.loginForm = this.fb.group({
			email: [null, Validators.compose([Validators.required, Validators.email, Validators.minLength(7)])],
			password: [null, Validators.compose([Validators.required, Validators.minLength(1)])]
		});
	}
	private loginForm: FormGroup;
	private resetForm() {
		this.loginForm.reset({
			email: null,
			password: null
		});
	}
	private submitForm() {
		console.log('SUBMIT', this.loginForm);
		if (this.loginForm.valid) {
			this.errorMessage = null;
			this.resetForm();
		} else {
			this.errorMessage = 'Invalid form input';
		}
	}
	public errorMessage: string;

	private emitSpinnerStartEvent() {
		console.log('root spinner start event emitted');
		this.emitter.emitEvent({sys: 'start spinner'});
	}
	private emitSpinnerStopEvent() {
		console.log('root spinner stop event emitted');
		this.emitter.emitEvent({sys: 'stop spinner'});
	}

	public ngOnInit() {
		console.log('ngOnInit: DashboardLoginComponent initialized');
		this.emitSpinnerStartEvent();
		this.emitter.emitEvent({route: '/login'});
		this.emitter.emitEvent({appInfo: 'hide'});
		this.emitSpinnerStopEvent();
	}
	public ngOnDestroy() {
		console.log('ngOnDestroy: DashboardLoginComponent destroyed');
	}
}
