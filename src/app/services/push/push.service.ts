import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

interface RequestPush {
  message: string;
  toId: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PushService {

  // url = environment.apiPush + 'api/push/user'

  constructor(
    private http: HttpClient
  ) { }

  // sendMessage(request: RequestPush): Promise<any> {
  //   // return this.http.post(this.url, request).toPromise()
  // }
}
