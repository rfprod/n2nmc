import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';

import { EventEmitterService } from '../services/event-emitter.service';
import { CustomDeferredService } from '../services/custom-deferred.service';

import { UsersListService } from '../services/users-list.service';

@Component({
	selector: 'dashboard-details',
	templateUrl: '/public/app/views/dashboard-details.html',
})
export class DashboardDetailsComponent implements OnInit, OnDestroy {

	constructor(
		private el: ElementRef,
		private emitter: EventEmitterService,
		private usersListService: UsersListService
	) {
		console.log('this.el.nativeElement:', this.el.nativeElement);
	}

	private subscription: any;

	public usersList: any[] = [];

	public userDetails: any = [];

	public errorMessage: string;

	private getUsersList(): Promise<any> {
		const def = new CustomDeferredService<any>();
		this.usersListService.getUsersList().subscribe(
			(data) => {
				this.usersList = data;
				this.userDetails = Array.apply(null, new Array(data.length)).map(() => false);
				def.resolve();
			},
			(error) => {
				this.errorMessage = error;
				def.reject();
			},
			() => console.log('getUserList done')
		);
		return def.promise;
	}

	public showDetails(index: number): void {
		this.userDetails[index] = true;
	}
	public hideDetails(index: number): void {
		this.userDetails[index] = false;
	}

/*
*	search
*/
	private searchValue: string;
	public get searchQuery() {
		return this.searchValue;
	}
	public set searchQuery(val) {
		this.emitSearchValueChangeEvent(val);
	}
	private emitSearchValueChangeEvent(val): void {
		console.log('searchValue changed to:', val);
		this.emitter.emitEvent({search: val});
	}

/*
*	sort
*/
	public orderProp = 'role';
	public get sortByCriterion() {
		return this.orderProp;
	}
	public set sortByCriterion(val) {
		this.emitOrderPropChangeEvent(val);
	}
	private emitOrderPropChangeEvent(val): void {
		console.log('orderProp changed to:', val);
		this.emitter.emitEvent({sort: val});
	}

	public ngOnInit(): void {
		console.log('ngOnInit: DashboardDetailsComponent initialized');
		this.emitter.emitSpinnerStartEvent();
		this.emitter.emitEvent({route: '/data'});
		this.emitter.emitEvent({appInfo: 'hide'});
		this.subscription = this.emitter.getEmitter().subscribe((event: any) => {
			console.log('/data consuming event:', JSON.stringify(event));
			if (event.search || event.search === '') {
				console.log('searching:', event.search);
				const domElsUsername = this.el.nativeElement.querySelector('ul.listing').querySelectorAll('#full-name');
				for (const usernameObj of domElsUsername) {
					if (usernameObj.innerHTML.toLowerCase().indexOf(event.search.toLowerCase()) !== -1) {
						usernameObj.parentElement.parentElement.style.display = 'block';
					} else {
						usernameObj.parentElement.parentElement.style.display = 'none';
					}
				}
			}
			if (event.sort) {
				/*
				* sorting rules
				*/
				console.log('sorting by:', event.sort);
				if (event.sort === 'registered') {
					this.usersList.sort((a, b) => {
						return b.registered - a.registered;
					});
				}
				if (event.sort === 'role') {
					this.usersList.sort((a, b) => {
						if (a.role < b.role) { return -1; }
						if (a.role > b.role) { return 1; }
						return 0;
					});
				}
			}
		});
		this.getUsersList().then(() => {
			this.emitter.emitSpinnerStopEvent();
		});
	}
	public ngOnDestroy(): void {
		console.log('ngOnDestroy: DashboardDetailsComponent destroyed');
		this.subscription.unsubscribe();
	}
}
