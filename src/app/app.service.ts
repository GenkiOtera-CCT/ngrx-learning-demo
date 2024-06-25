import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  readonly initialText: string = '0: 待機中';
  waitInterval: number = 1;

  //#region サンプル用のObservableの定義（ただのObservableは事前にsubscribeされた際の処理を定義する）
  simpleManObservable$ = new Observable<string>((observer) => {
    const massages: string[] = [
      '1: はじめまして',
      '2: (年齢)30歳',
      '3: (性別)男性',
      '4: (趣味)そば打ち',
      '5: 以上です。',
    ];
    
    // デモ用の非同期処理のため、参考にしないように。
    (async () => {
      // 一定間隔でメッセージを更新
      await this.pushMessagesAsync(observer, massages);
      // 終了を通知
      this.toCompleteAsync(observer);
    })();
  });
  //#endregion

  constructor() { }

  // デモ用に任意の時間間隔でメッセージを送信する非同期処理
  private async pushMessagesAsync(observer: Subscriber<string>, messages:string[]): Promise<void> {
    for (const message of messages) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          observer.next(message);
          resolve();
        }, this.waitInterval * 1000);
      });
    }
  }

  // デモ用に任意の時間後に完了を通知する非同期処理
  private async toCompleteAsync(observer: Subscriber<string>): Promise<void> {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        observer.complete();
        resolve();
      }, this.waitInterval * 1000);
    });
  }
}
