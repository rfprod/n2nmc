import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { EventEmitterService } from './services/event-emitter.service';

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
	constructor( public el: ElementRef, private emitter: EventEmitterService ) {
		console.log('this.el.nativeElement', this.el.nativeElement);
	}
	public startSpinner() {
		console.log('spinner start');
		this.showSpinner = true;
	}
	public stopSpinner() {
		console.log('spinner stop');
		this.showSpinner = false;
	}
	public ngOnInit() {
		console.log('ngOnInit: AppComponent initialized');
		$('#init').remove();
		this.subscription = this.emitter.getEmitter().subscribe((message) => {
			console.log('app consuming event:', message);
			if (message.sys === 'start spinner') {
				console.log('starting spinner');
				this.startSpinner();
			}
			if (message.sys === 'stop spinner') {
				console.log('stopping spinner');
				this.stopSpinner();
			}
		});
	}
	public ngOnDestroy() {
		console.log('ngOnDestroy: AppComponent destroyed');
		this.subscription.unsubscribe();
	}
}
