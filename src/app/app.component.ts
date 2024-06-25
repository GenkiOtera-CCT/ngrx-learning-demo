import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatSlideToggleModule,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {

  simpleObservableState: number = 0;
  isMultiSubscribing: boolean = false;
  simpleObserveText: string;
  anotherSimpleObserveText: string;
  
  simpleSubjectState: number = 0;
  simpleSubjectText: string;
  simpleSubjectInputMessagge: string = '';

  behaviorSubjectState: number = 0;
  behaviorSubjectText: string;
  behaviorSubjectInputMessagge: string = '';

  simpleSubject$: Subject<string>;

  constructor(
    // 待機時間を同期するために敢えてpublicにしているので、参考にしないように。
    public service: AppService
  ) {
    this.simpleObserveText = service.initialText;
    this.anotherSimpleObserveText = `マルチ：${service.initialText}`;

    this.simpleSubjectText = service.initialText;
    this.behaviorSubjectText = service.initialText;

    this.simpleSubject$ = service.simpleSubject$;
  }
  
  onClickStartSimpleObserve(withError:boolean = false): void {
    let changeCount: number = 0;
    this.simpleObservableState = 1;

    // 途中でエラーを発生させるかどうか
    this.service.withErrorSimpleObservable = withError;

    // subscribeすることでObservableが動き出す
    this.service.simpleObservable$.subscribe({
      next: (value) => {
        changeCount++; // マルチの方にも影響するため、ここでインクリメント
        this.simpleObserveText = `${changeCount}: ${value}`;
      },
      error: (error) => {
        this.simpleObservableState = 99;
        this.simpleObserveText = `${error} （待機中）`;
      },
      complete: () => {
        this.simpleObservableState = 0;
        this.simpleObserveText = this.service.initialText;
      }
    });
    // このようにsubscribeすると、同じObservableを複数回subscribeすることができる。
    if(this.isMultiSubscribing) {
      this.service.simpleObservable$.subscribe({
        next: (value) => {
          this.anotherSimpleObserveText = `マルチ -> ${changeCount}: ${value}`;
        },
        complete: () => {
          this.anotherSimpleObserveText = `マルチ：${this.service.initialText}`;
        }
      });
    }
  }

  //#region SimpleSubject
  onClickStartSubscribeSimpleSubject(): void {
    let changeCount: number = 1;
    this.simpleSubjectText = `${changeCount}: サブスクライブ中`;
    // subscribeすることでSubjectが動き出す
    this.service.simpleSubject$.subscribe({
      next: (value) => {
        this.simpleSubjectState = 1;
        this.simpleSubjectText = `${changeCount}: ${value}`;
        changeCount++;
      },
      error: (error) => {
        this.simpleSubjectState = 99;
        this.simpleSubjectText = error;
      },
      complete: () => {
        this.simpleSubjectState = 2;
        this.simpleSubjectText = '終了（※再利用不可）';
      }
    });
  }

  onClickSendMessageToSimpleSubject(): void {
    this.service.updateSimpleSubject(this.simpleSubjectInputMessagge);
  }

  onClickGenerateErrorToSimpleSubject(): void {
    this.service.generateErrorSimpleSubject();
  }

  /**
   * コンポーネント側からもSubjectを完了させることができるが、
   * サービスとの依存関係が強くなるため、基本的にはサービス側で完了させるようにする。
   **/ 
  onClickFinishSimpleSubject(): void {
    this.service.completeSimpleSubject();
  }
  //#endregion

  //#region BehaviorSubject
  onClickStartSubscribeBehaviorSubject(): void {
    let changeCount: number = 1;
    // subscribeすることでSubjectが動き出す
    this.service.behaviorSubject$.subscribe({
      // 値を保持していることを表現するために、初回のnextでは画像を変更しないようにしている。
      next: (value) => {
        if(changeCount > 1) {
          this.behaviorSubjectState = 1;
        }
        this.behaviorSubjectText = `${changeCount}: ${value}`;
        changeCount++;
      },
      complete: () => {
        this.behaviorSubjectState = 2;
        this.behaviorSubjectText = '終了（※再利用不可）';
      }
    });
  }

  onClickSendMessageToBehaviorSubject(): void {
    this.service.updateBehaviorSubject(this.behaviorSubjectInputMessagge);
  }

  /**
   * コンポーネント側からもSubjectを完了させることができるが、
   * サービスとの依存関係が強くなるため、基本的にはサービス側で完了させるようにする。
   **/ 
  onClickFinishBehaviorSubject(): void {
    this.service.completeBehaviorSubject();
  }
  //#endregion
}
