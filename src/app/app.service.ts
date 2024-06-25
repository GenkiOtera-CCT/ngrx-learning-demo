import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public simpleManObservable$ = new Observable<string>((observer) => {
    observer.next('1: はじめまして');
    observer.next('2: (年齢)30歳');
    observer.next('3: (性別)男性');
    observer.next('4: (趣味)そば打ち');
    observer.next('5: 以上です。');
    observer.complete();
  });

  public simpleWomanObservable$ = new Observable<string>((observer) => {
    observer.next('1: はじめまして');
    observer.next('2: (年齢)30歳');
    observer.next('3: (性別)男性');
    observer.next('4: (趣味)そば打ち');
    observer.next('5: 以上です。');
    observer.complete();
  });

  constructor() { }
}
