import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class UsersListService {

	constructor(
		private http: Http,
		@Inject('Window') private window: Window
	) {}

	private appDataUrl: string = this.window.location.origin + '/api/users';

	private extractData(res: Response): object {
		const body = res.json();
		return body || {};
	}

	private handleError(error: any) {
		const errMsg = (error.message) ? error.message :
			error.status ? `$[error.status] - $[error.statusText]` : 'Server error';
		console.log(errMsg);
		return Observable.throw(errMsg);
	}

	public getUsersList(): Observable<any[]> {
		return this.http.get(this.appDataUrl)
			.map(this.extractData)
			.catch(this.handleError);
	}
}
