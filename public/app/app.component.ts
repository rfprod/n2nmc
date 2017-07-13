import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { EventEmitterService } from './services/event-emitter.service';
import { TranslateService } from './translate/index';

declare let $: JQueryStatic;

@Component({
	selector: 'root',
	template: `
		<app-nav></app-nav>
		<router-outlet></router-outlet>
		<app-info></app-info>
		<span id="spinner" *ngIf="showSpinner"><img src="../public/img/gears.svg"/></span>
	`,
})
export class AppComponent implements OnInit, OnDestroy {

	private subscription: any;
	private showSpinner: boolean = true;

	public supportedLanguages: any[];

	constructor( public el: ElementRef, private emitter: EventEmitterService, private _translate: TranslateService ) {
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
		return key === this._translate.currentLanguage;
	}
	public selectLanguage(key: string) {
		// set current language
		if (!this.isCurrentLanguage(key)) {
			this._translate.use(key);
		}
	}

	public ngOnInit() {
		console.log('ngOnInit: AppComponent initialized');

		$('#init').remove(); // remove initialization text

		// listen event emitter control messages
		this.subscription = this.emitter.getEmitter().subscribe((message) => {
			console.log('app consuming event:', message);
			if (message.sys === 'start spinner') { // spinner control message
				console.log('starting spinner');
				this.startSpinner();
			} else if (message.sys === 'stop spinner') { // spinner control message
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
	}

	public ngOnDestroy() {
		console.log('ngOnDestroy: AppComponent destroyed');
		this.subscription.unsubscribe();
	}

}
