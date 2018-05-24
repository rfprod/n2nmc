import { Component, OnInit, OnDestroy, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from './services/event-emitter.service';
import { TranslateService } from './translate/index';
import { CustomServiceWorkerService } from './services/custom-service-worker.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

declare let $: JQueryStatic;

@Component({
	selector: 'root',
	template: `
		<app-nav></app-nav>
		<router-outlet></router-outlet>
		<app-info></app-info>
		<span id="spinner" *ngIf="showSpinner">
			<img src="../public/img/gears.svg"/>
		</span>
	`,
	animations: [
		trigger('empty', [])
	]
})
export class AppComponent implements OnInit, OnDestroy {

	constructor(
		private el: ElementRef,
		private emitter: EventEmitterService,
		private translate: TranslateService,
		private router: Router,
		private serviceWorker: CustomServiceWorkerService,
		@Inject('Window') private window: Window
	) {
		console.log('this.el.nativeElement', this.el.nativeElement);
	}

	private subscriptions: any[] = [];

	public showSpinner: boolean = false;

/*
*	spinner controls
*/
	private startSpinner() {
		console.log('spinner start');
		this.showSpinner = true;
	}
	private stopSpinner() {
		console.log('spinner stop');
		this.showSpinner = false;
	}

	public supportedLanguages: any[] = [
		{ key: 'en', name: 'English' },
		{ key: 'ru', name: 'Russian' }
	];

	public isCurrentLanguage(key: string) {
		// check if selected one is a current language
		return key === this.translate.currentLanguage;
	}
	public selectLanguage(key: string) {
		// set current language
		if (!this.isCurrentLanguage(key)) {
			this.translate.use(key);
		}
	}

	public ngOnInit() {
		console.log('ngOnInit: AppComponent initialized');

		$('#init').remove(); // remove initialization text

		// event emitter control messages
		let sub = this.emitter.getEmitter().subscribe((message: any) => {
			console.log('app consuming event:', message);
			if (message.spinner === 'start') { // spinner control message
				console.log('starting spinner');
				this.startSpinner();
			} else if (message.spinner === 'stop') { // spinner control message
				console.log('stopping spinner');
				this.stopSpinner();
			} else if (message.lang) { // switch translation message
				console.log('switch language', message.lang);
				if (this.supportedLanguages.filter((item) => item.key === message.lang).length) {
					// switch language only if it is present in supportedLanguages array
					this.selectLanguage(message.lang);
				} else {
					console.log('selected language is not supported');
				}
			}
		});
		this.subscriptions.push(sub);

		/*
		* check preferred language, respect preference if dictionary exists
		*	for now there are only dictionaries only: English, Russian
		*	set Russian if it is preferred, else use English
		*/
		const nav: any = this.window.navigator;
		const userPreference: string = (nav.language === 'ru-RU' || nav.language === 'ru' || nav.languages[0] === 'ru') ? 'ru' : 'en';
		// set default language
		this.selectLanguage(userPreference);

		// router events
		sub = this.router.events.subscribe((event) => {
			console.log(' > ROUTER EVENT:', event);
		});
		this.subscriptions.push(sub);
	}

	public ngOnDestroy() {
		console.log('ngOnDestroy: AppComponent destroyed');
		this.serviceWorker.disableServiceWorker();
		for (const sub of this.subscriptions) {
			sub.unsubscribe();
		}
	}

}
