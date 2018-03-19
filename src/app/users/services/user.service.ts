import { Provider, SkipSelf, Optional, InjectionToken } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HttpInterceptorService, RESTService } from '@covalent/http';

// andrew
import { Headers } from '@angular/http';

export interface IUser {
  displayName: string;
  id: string;
  email: string;
  created: Date;
  lastAccess: Date;
  siteAdmin: number;
  disabled: boolean;
  favorite: number;
}

export class UserService extends RESTService<IUser> {

  constructor(private _http: HttpInterceptorService, api: string) {
    super(_http, {
      baseUrl: api,
      path: '/users',
      /*baseHeaders: new Headers({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Origin': '*'
      }), // andrew
      dynamicHeaders: () => new Headers({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Origin': '*'
      }), // andrew
      //transform: (res: Response): any => res.json(), // andrew
      */
    });
  }

  staticQuery(): Observable<IUser[]> {
    return this._http.get('data/users.json')
    .map((res: Response) => {
      return res.json();
    });
  }
}

export const USERS_API: InjectionToken<string> = new InjectionToken<string>('USERS_API');

export function USER_PROVIDER_FACTORY(
    parent: UserService, interceptorHttp: HttpInterceptorService, api: string): UserService {
  return parent || new UserService(interceptorHttp, api);
}

export const USER_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: UserService,
  deps: [[new Optional(), new SkipSelf(), UserService], HttpInterceptorService, USERS_API],
  useFactory: USER_PROVIDER_FACTORY,
};
