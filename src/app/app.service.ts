import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscriber, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  readonly initialText: string = '0: 待機中';
  waitInterval: number = 1;
  withErrorSimpleObservable: boolean = false;

  //#region サンプル用のObservableの定義（ただのObservableは事前にsubscribeされた際の処理を定義する）
  simpleObservable$ = new Observable<string>((observer) => {
    const massages: string[] = [
      'はじめまして',
      '年齢は30歳',
      '性別は男',
      '趣味は読書です',
      '以上です',
    ];
    // デモ用の非同期処理のため、参考にしないように。
    try {
      (async () => {
        // 一定間隔でメッセージを更新
        await this.pushMessagesAsync(observer, massages);
        // 終了を通知
        this.toCompleteAsync(observer);
      })();
    } catch (error) {
      observer.error(error);
    }
  });
  //#endregion

  simpleSubject$ = new Subject<string>();
  behaviorSubject$ = new BehaviorSubject<string>('秘書です。最新のメッセージを記憶できます。');
  subjectWithPipe$ = new Subject<number>();

  constructor() { }

  //#region SimpleSubject
  updateSimpleSubject(value: string): void {
    this.simpleSubject$.next(value);
  }

  generateErrorSimpleSubject(): void {
    this.simpleSubject$.error('エラー発生');
  }

  completeSimpleSubject(): void {
    this.simpleSubject$.complete();
  }
  //#endregion

  //#region BehaviorSubject
  updateBehaviorSubject(value: string): void {
    this.behaviorSubject$.next(value);
  }

  completeBehaviorSubject(): void {
    this.behaviorSubject$.complete();
  }
  //#endregion

  //#region Pipe operators
  filteredBehaviorSubject$ = this.subjectWithPipe$.pipe(
    filter(value => value === 2)
  );
  //#endregion

  // デモ用に任意の時間間隔でメッセージを送信する非同期処理
  private async pushMessagesAsync(observer: Subscriber<string>, messages:string[]): Promise<void> {
    let index: number = 0;
    for (const message of messages) {
      try {
        await new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            if (this.withErrorSimpleObservable && index === 3) {
              reject(new Error('エラー発生'));
            }
            observer.next(message);
            index++;
            resolve();
          }, this.waitInterval * 1000);
        });
      } catch (error) {
        observer.error(error);
        throw error;
      }
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
