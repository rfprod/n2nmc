import { Injectable } from '@angular/core';

import { EventEmitterService } from './event-emitter.service';

@Injectable()
export class UserService {

	constructor(
		private emitter: EventEmitterService
	) {
		this.initializeModel();
		if (typeof localStorage.getItem('userService') === 'undefined' && localStorage.userService) {
			localStorage.setItem('userService', JSON.stringify(this.model));
		} else {
			this.RestoreUser();
		}
		console.log(' >> USER SERVICE CONSTRUCTOR, model', this.model);
	}

	/**
	 * User model.
	 */
	private model: any;

	/**
	 * Initializes user model.
	 */
	private initializeModel(): void {
		this.model = { email: null, token: null };
	}

	/**
	 * Returns user model.
	 */
	public getUser(): object {
		return this.model;
	}

	/**
	 * Updates user modal values.
	 */
	public SaveUser(newValues): void {
		console.log('SaveUser', newValues);
		if ('email' in newValues) {
			this.model.email = newValues.email;
		}
		if ('token' in newValues) {
			this.model.token = newValues.token;
		}
		localStorage.setItem('userService', JSON.stringify(this.model));
		this.emitUserChangeEvent();
	}

	/**
	 * Emits user change event.
	 */
	private emitUserChangeEvent(): void {
		this.emitter.emitEvent({ user: this.model });
	}

	/**
	 * Restores user model from browser local storage.
	 */
	public RestoreUser(): void {
		console.log('Restore User, localStorage.userService:', localStorage.getItem('userService'));
		if (typeof localStorage.getItem('userService') !== 'undefined' && localStorage.userService) {
			this.model = JSON.parse(localStorage.getItem('userService'));
			this.emitUserChangeEvent();
		}
	}

	/**
	 * Resets user model and browser local storage.
	 */
	public ResetUser(): void {
		this.initializeModel();
		localStorage.setItem('userService', JSON.stringify(this.model));
		this.emitUserChangeEvent();
	}
}
