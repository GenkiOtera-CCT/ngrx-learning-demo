import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageResponse } from '../interfaces/api';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private http = inject(HttpClient);

  getShortTimeRequest() : Observable<MessageResponse> {
    return this.http.get<MessageResponse>('/api/short');
  }

  getLongTimeRequest() : Observable<MessageResponse> {
    return this.http.get<MessageResponse>('api/long');
  }

  getErrorRequest() : Observable<any> {
    return this.http.get('api/error');
  }
  
  getFragileRequest(successRate:number) : Observable<MessageResponse> {
    return this.http.get<MessageResponse>(`api/fragile?successRate=${successRate}`);
  }
}
