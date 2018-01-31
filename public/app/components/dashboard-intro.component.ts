import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { EventEmitterService } from '../services/event-emitter.service';
import { ServerStaticDataService } from '../services/server-static-data.service';
import { PublicDataService } from '../services/public-data.service';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/first';

declare let d3: any;

@Component({
	selector: 'dashboard-intro',
	templateUrl: '/public/app/views/dashboard-intro.html',
})
export class DashboardIntroComponent implements OnInit, OnDestroy {
	constructor(
		private el: ElementRef,
		private emitter: EventEmitterService,
		private serverStaticDataService: ServerStaticDataService,
		private publicDataService: PublicDataService
	) {
		console.log('this.el.nativeElement:', this.el.nativeElement);
	}
	private ngUnsubscribe: Subject<void> = new Subject();
	public title: string = 'Ng2NodeMongoCore (N2NMC)';
	public description: string = 'Angular, NodeJS, MongoDB';
	public chartOptions: object = {
		chart: {
			type: 'pieChart',
			height: 450,
			donut: true,
			x: (d) => d.key,
			y: (d) => d.y,
			showLabels: true,
			labelSunbeamLayout: false,
			pie: {
				startAngle: (d) => d.startAngle / 2 - Math.PI / 2,
				endAngle: (d) => d.endAngle / 2 - Math.PI / 2,
			},
			duration: 1000,
			title: 'accounts',
			legend: {
				margin: {
					top: 5,
					right: 140,
					bottom: 5,
					left: 0,
				},
			},
		},
	};
	public appUsageData: any[] = [
		{
			key: 'Default',
			y: 1,
		},
		{
			key: 'Default',
			y: 1,
		},
		{
			key: 'Default',
			y: 1,
		},
		{
			key: 'Default',
			y: 1,
		},
		{
			key: 'Default',
			y: 1,
		}
	];
	public serverData: any = {
		static: [],
		dynamic: [],
	};
	private host: string = window.location.host;
	private wsUrl: string = (this.host.indexOf('localhost') !== -1) ? 'ws://' + this.host + '/api/app-diag/dynamic' : 'ws://' + this.host + ':8000/api/app-diag/dynamic';
	private ws = new WebSocket(this.wsUrl);
	public errorMessage: string;
	private getServerStaticData(callback) {
		this.serverStaticDataService.getData().first().subscribe(
			(data) => this.serverData.static = data,
			(error) => this.errorMessage = error as any,
			() => {
				console.log('getServerStaticData done, data:', this.serverData.static);
				callback(this);
			}
		);
	}
	private getPublicData(callback) {
		this.publicDataService.getData().first().subscribe(
			(data) => {
				this.nvd3.clearElement();
				this.appUsageData = data;
			},
			(error) => this.errorMessage = error as any,
			() => {
				console.log('getPublicData done, data:', this.appUsageData);
				callback(this);
			}
		);
	}

	private emitSpinnerStartEvent() {
		console.log('root spinner start event emitted');
		this.emitter.emitEvent({spinner: 'start'});
	}
	private emitSpinnerStopEvent() {
		console.log('root spinner stop event emitted');
		this.emitter.emitEvent({spinner: 'stop'});
	}

	public showModal: boolean = false;
	public toggleModal() {
		if (this.showModal) {
			this.ws.send(JSON.stringify({action: 'pause'}));
		} else { this.ws.send(JSON.stringify({action: 'get'})); }
		this.showModal = (!this.showModal) ? true : false;
	}

	@ViewChild('chart') public nvd3: any;

	public ngOnInit() {
		console.log('ngOnInit: DashboardIntroComponent initialized');
		this.emitSpinnerStartEvent();
		this.emitter.emitEvent({route: '/intro'});
		this.emitter.emitEvent({appInfo: 'show'});

		this.ws.onopen = (evt) => {
			console.log('websocket opened:', evt);
			/*
			*	ws connection is established, but data is requested
			*	only when this.showModal switches to true, i.e.
			*	app diagnostics modal is visible to a user
			*/
			// this.ws.send(JSON.stringify({action: 'get'}));
		};
		this.ws.onmessage = (message) => {
			console.log('websocket incoming message:', message);
			this.serverData.dynamic = [];
			const data = JSON.parse(message.data);
			for (const d in data) {
				if (data[d]) { this.serverData.dynamic.push(data[d]); }
			}
			console.log('this.serverData.dynamic:', this.serverData.dynamic);
		};
		this.ws.onerror = (evt) => {
			console.log('websocket error:', evt);
			this.ws.close();
		};
		this.ws.onclose = (evt) => {
			console.log('websocket closed:', evt);
		};

		this.emitter.getEmitter().takeUntil(this.ngUnsubscribe).subscribe((message: any) => {
			console.log('/intro consuming event:', message);
			if (message.websocket === 'close') {
				console.log('closing webcosket');
				this.ws.close();
			}
		});

		this.getPublicData((/*scope*/) => {
			this.getServerStaticData((/*scope*/) => {
				this.emitSpinnerStopEvent();
			});
		});

	}
	public ngOnDestroy() {
		console.log('ngOnDestroy: DashboardIntroComponent destroyed');
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
		this.ws.close();
	}
}
