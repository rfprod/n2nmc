import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CustomHttpHandlersService } from './custom-http-handlers.service';

import { Observable } from 'rxjs';
import { timeout, take, map, catchError } from 'rxjs/operators';

@Injectable()
export class PublicDataService {

	constructor(
		private http: HttpClient,
		private httpHandlers: CustomHttpHandlersService,
		@Inject('Window') private window: Window
	) {}

	private endpoint: string = this.window.location.origin + '/api/app-diag/usage';

	public getData(): Observable<any> {
		return this.http.get(this.endpoint).pipe(
			timeout(10000),
			take(1),
			map(this.httpHandlers.extractArray),
			catchError(this.httpHandlers.handleError)
		);
	}
}
