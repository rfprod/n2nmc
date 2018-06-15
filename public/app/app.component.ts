import { Component, OnInit, OnDestroy, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { EventEmitterService } from './services/event-emitter.service';
import { TranslateService } from './translate/index';
import { CustomServiceWorkerService } from './services/custom-service-worker.service';

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
	`
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

	/**
	 * Component subscriptions.
	 */
	private subscriptions: any[] = [];

	/**
	 * Indicates if spinner should be shown or not.
	 */
	public showSpinner: boolean = false;

	/**
	 * Shows spinner.
	 */
	private startSpinner(): void {
		console.log('spinner start');
		this.showSpinner = true;
	}
	/**
	 * Hides spinner.
	 */
	private stopSpinner(): void {
		console.log('spinner stop');
		this.showSpinner = false;
	}

	/**
	 * Supported languages.
	 */
	public supportedLanguages: Array<{key: string, name: string}> = [
		{ key: 'en', name: 'English' },
		{ key: 'ru', name: 'Russian' }
	];

	/**
	 * Resolves if language is current by key.
	 * @param key language key
	 */
	public isCurrentLanguage(key: string): boolean {
		return key === this.translate.currentLanguage;
	}
	/**
	 * Selects language.
	 * @param key language key
	 */
	public selectLanguage(key: string): void {
		if (!this.isCurrentLanguage(key)) {
			this.translate.use(key);
		}
	}

	public ngOnInit(): void {
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

	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppComponent destroyed');
		this.serviceWorker.disableServiceWorker();
		for (const sub of this.subscriptions) {
			sub.unsubscribe();
		}
	}

}
