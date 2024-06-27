import { Injectable } from '@angular/core';
import { RepositoryService } from './repository.service';
import { Observable, concat, forkJoin, retry } from 'rxjs';
import { MessageResponse } from '../interfaces/api';

@Injectable({
  providedIn: 'root'
})
export class PracticeContentsService {

  constructor(
    private repository: RepositoryService
  ) {}

  getShortTimeRequest() : Observable<MessageResponse> {
    return this.repository.getShortTimeRequest();
  }

  getLongTimeRequest() : Observable<MessageResponse> {
    return this.repository.getLongTimeRequest();
  }

  getOrderedRequest() : Observable<MessageResponse> {
    return concat(
      this.getShortTimeRequest(),
      this.getLongTimeRequest()
    );
  }

  getJoinedRequest() : Observable<[MessageResponse, MessageResponse]> {
    return forkJoin([
      this.getShortTimeRequest(),
      this.getLongTimeRequest()
    ]);
  }

  getErrorRequest() : Observable<any> {
    return this.repository.getErrorRequest();
  }

  getFragileRequest(successRate:number) : Observable<MessageResponse> {
    return this.repository.getFragileRequest(successRate);
  }

  getErrorRequestWithRetry(successRate:number) : Observable<MessageResponse> {
    return this.repository.getFragileRequest(successRate).pipe(
      retry({
        count: 10,
        delay: 3000,
      }),
    );
  }
}
