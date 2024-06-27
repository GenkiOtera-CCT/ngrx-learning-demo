import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageResponse } from '../interfaces/api';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  constructor(
    private http: HttpClient
  ) { }

  getShortTimeRequest() : Observable<MessageResponse> {
    return this.http.get<MessageResponse>('/api/short');
  }

  getLongTimeRequest() : Observable<MessageResponse> {
    return this.http.get<MessageResponse>('api/long');
  }

  getErrorRequest() : Observable<any> {
    return this.http.get('');
  }
  
  getFragileRequest() : Observable<any> {
    return this.http.get('');
  }
}
