import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { timeout, take, map, catchError } from 'rxjs/operators';

@Injectable()
export class ServerStaticDataService {

	constructor(
		private http: HttpClient,
		@Inject('Window') private window: Window
	) {}

	private appDataUrl: string = this.window.location.origin + '/api/app-diag/static';

	private extractArray(res: any[]): any[] {
		return res || [];
	}

	private handleError(error: any): string {
		const errMsg = (error.message) ? error.message :
			error.status ? `$[error.status] - $[error.statusText]` : 'Server error';
		console.log(errMsg);
		return errMsg;
	}

	public getData(): Observable<any> {
		return this.http.get(this.appDataUrl).pipe(
			timeout(10000),
			take(1),
			map(this.extractArray),
			catchError(this.handleError)
		);
	}
}
