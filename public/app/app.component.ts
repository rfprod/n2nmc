import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from './services/event-emitter.service';
import { TranslateService } from './translate/index';
import { trigger, state, style, transition, animate } from '@angular/animations';

declare let $: JQueryStatic;

@Component({
	selector: 'root',
	template: `
		<app-nav></app-nav>
		<router-outlet></router-outlet>
		<app-info></app-info>
		<span id="spinner" *ngIf="showSpinner"><img src="../public/img/gears.svg"/></span>
	`,
	animations: [
		trigger('empty', [])
	]
})
export class AppComponent implements OnInit, OnDestroy {

	private subscriptions: any = {
		eventEmitter: undefined,
		router: undefined
	};
	private showSpinner: boolean = false;

	public supportedLanguages: any[];

	constructor( public el: ElementRef, private emitter: EventEmitterService, private translate: TranslateService, private router: Router ) {
		console.log('this.el.nativeElement', this.el.nativeElement);
	}

	// spinner controls
	public startSpinner() {
		console.log('spinner start');
		this.showSpinner = true;
	}
	public stopSpinner() {
		console.log('spinner stop');
		this.showSpinner = false;
	}

	private isCurrentLanguage(key: string) {
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

		// listen event emitter control messages
		this.subscriptions.eventEmitter = this.emitter.getEmitter().subscribe((message) => {
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

		// init supported languages
		this.supportedLanguages = [
			{ key: 'en', name: 'English' },
			{ key: 'ru', name: 'Russian' }
		];

		// set default language
		this.selectLanguage('en');

		this.subscriptions.router = this.router.events.subscribe((event) => {
			console.log(' > ROUTER EVENT:', event);
		});
	}

	public ngOnDestroy() {
		console.log('ngOnDestroy: AppComponent destroyed');
		this.subscriptions.eventEmitter.unsubscribe();
		this.subscriptions.router.unsubscribe();
	}

}
