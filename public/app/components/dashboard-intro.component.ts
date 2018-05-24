import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

import { EventEmitterService } from '../services/event-emitter.service';
import { CustomDeferredService } from '../services/custom-deferred.service';

import { ServerStaticDataService } from '../services/server-static-data.service';
import { PublicDataService } from '../services/public-data.service';

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
	private subscriptions: any[] = [];

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
	private getServerStaticData(): Promise<any> {
		const def = new CustomDeferredService<any>();
		const sub = this.serverStaticDataService.getData().subscribe(
			(data: any[]) => {
				this.serverData.static = data;
				def.resolve();
			},
			(error: string) => {
				this.errorMessage = error;
				def.reject();
			},
			() => console.log('getServerStaticData done, data:', this.serverData.static)
		);
		this.subscriptions.push(sub);
		return def.promise;
	}
	private getPublicData(): Promise<any> {
		const def = new CustomDeferredService<any>();
		const sub = this.publicDataService.getData().subscribe(
			(data: any[]) => {
				this.nvd3.clearElement();
				this.appUsageData = data;
				def.resolve();
			},
			(error: string) => {
				this.errorMessage = error;
				def.reject();
			},
			() => console.log('getPublicData done, data:', this.appUsageData)
		);
		this.subscriptions.push(sub);
		return def.promise;
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
		this.emitter.emitSpinnerStartEvent();
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

		const sub = this.emitter.getEmitter().subscribe((message: any) => {
			console.log('/intro consuming event:', message);
			if (message.websocket === 'close') {
				console.log('closing webcosket');
				this.ws.close();
			}
		});
		this.subscriptions.push(sub);

		this.getPublicData()
			.then(() => this.getServerStaticData())
			.then(() => {
				this.emitter.emitSpinnerStopEvent();
			});

	}
	public ngOnDestroy() {
		console.log('ngOnDestroy: DashboardIntroComponent destroyed');
		this.ws.close();
		for (const sub of this.subscriptions) {
			sub.unsubscribe();
		}
	}
}
