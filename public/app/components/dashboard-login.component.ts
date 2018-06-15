import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { EventEmitterService } from '../services/event-emitter.service';
import { UserService } from '../services/user.service';

import { ServerStaticDataService } from '../services/server-static-data.service';
import { PublicDataService } from '../services/public-data.service';

@Component({
	selector: 'dashboard-login',
	templateUrl: '/public/app/views/dashboard-login.html',
})
export class DashboardLoginComponent implements OnInit, OnDestroy {

	constructor(
		private el: ElementRef,
		private emitter: EventEmitterService,
		private fb: FormBuilder,
		private userService: UserService,
		private serverStaticDataService: ServerStaticDataService,
		private publicDataService: PublicDataService
	) {
		console.log('this.el.nativeElement:', this.el.nativeElement);
		console.log('localStorage.userService', JSON.stringify(localStorage.userService));
		const restoredModel: any = this.userService.getUser();
		console.log('restoredModel use model', restoredModel);
		this.loginForm = this.fb.group({
			email: [restoredModel.email, Validators.compose([Validators.required, Validators.email, Validators.minLength(7)])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
		});
	}

	public loginForm: FormGroup;

	public resetForm(): void {
		this.loginForm.reset({
			email: null,
			password: null
		});
		this.userService.ResetUser();
	}

	public submitForm(): void {
		console.log('SUBMIT', this.loginForm);
		if (this.loginForm.valid) {
			this.errorMessage = null;
			this.userService.SaveUser({ email: this.loginForm.controls.email.value });
		} else {
			this.errorMessage = 'Invalid form input';
		}
	}

	public errorMessage: string;

	public ngOnInit(): void {
		console.log('ngOnInit: DashboardLoginComponent initialized');
		this.emitter.emitSpinnerStartEvent();
		this.emitter.emitEvent({route: '/login'});
		this.emitter.emitEvent({appInfo: 'hide'});
		this.emitter.emitSpinnerStopEvent();
	}
	public ngOnDestroy(): void {
		console.log('ngOnDestroy: DashboardLoginComponent destroyed');
	}
}
