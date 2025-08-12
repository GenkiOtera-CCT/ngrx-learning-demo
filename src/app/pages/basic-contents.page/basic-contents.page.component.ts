import { Component, inject, model, OnDestroy, signal } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { Crew } from '../../interfaces/crew';
import { BasicContentsService } from '../../services/basic-contents.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-basic-contents.page',
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatSlideToggleModule,
    ],
    templateUrl: './basic-contents.page.component.html',
    styleUrl: './basic-contents.page.component.css'
})
export class BasicContentsPageComponent implements OnDestroy {

  // 待機時間を同期するために敢えてpublicにしているので、参考にしないように。
  readonly service = inject(BasicContentsService);

  readonly simpleObservableState = model(0);
  readonly isMultiSubscribing = model(false);
  readonly simpleObserveText = signal(this.service.initialText);
  readonly anotherSimpleObserveText = signal(`マルチ：${this.service.initialText}`);

  readonly simpleSubjectState = signal(0);
  readonly simpleSubjectText = signal(this.service.initialText);
  readonly simpleSubjectInputMessagge = signal('');

  readonly behaviorSubjectState = signal(0);
  readonly behaviorSubjectText = signal(this.service.initialText);
  readonly behaviorSubjectInputMessagge = signal('');

  readonly simpleSubject$: Subject<string> = this.service.simpleSubject$;

  readonly eventValue = signal<number | null>(null);
  readonly crews: Crew[] = [
    {id: 0, name: 'ルフィ'},
    {id: 1, name: 'ゾロ'},
    {id: 2, name: 'ナミ'}
  ];
  readonly selectedCrewId = signal<number | null>(null);
  readonly isShowTheMan = signal(false);

  private readonly subscriptions: Subscription[] = [
    // filterオペレーターの有無で１と２で渡ってくるイベントの違いが分かる。
    // １：filterオペレーターなし
    this.service.subjectWithPipe$.subscribe((value:number) => {
      this.selectedCrewId.set(value);
    }),
    // ２：filterオペレーターあり
    this.service.filteredBehaviorSubject$.subscribe((value:number) => {
      this.eventValue.set(value);
      this.isShowTheMan.set(true);
    }),
  ];

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  
  onClickStartSimpleObserve(withError:boolean = false): void {
    let changeCount: number = 0;
    this.simpleObservableState.set(1);

    // 途中でエラーを発生させるかどうか
    this.service.withErrorSimpleObservable = withError;

    // subscribeすることでObservableが動き出す
    this.service.simpleObservable$.subscribe({
      next: (value) => {
        changeCount++; // マルチの方にも影響するため、ここでインクリメント
        this.simpleObserveText.set(`${changeCount}: ${value}`);
      },
      error: (error) => {
        this.simpleObservableState.set(99);
        this.simpleObserveText.set(`${error} （待機中）`);
      },
      complete: () => {
        this.simpleObservableState.set(0);
        this.simpleObserveText.set(this.service.initialText);
      }
    });
    // このようにsubscribeすると、同じObservableを複数回subscribeすることができる。
    if(this.isMultiSubscribing()) {
      setTimeout(() => {
        this.service.simpleObservable$.subscribe({
          next: (value) => {
            this.anotherSimpleObserveText.set(`マルチ -> ${changeCount}: ${value}`);
          },
          complete: () => {
            this.anotherSimpleObserveText.set(`マルチ：${this.service.initialText}`);
          }
        });
      }, 300);
    }
  }

  //#region SimpleSubject
  onClickStartSubscribeSimpleSubject(): void {
    let changeCount: number = 1;
    this.simpleSubjectText.set(`${changeCount}: サブスクライブ中`);
    // subscribeすることでSubjectが動き出す
    this.service.simpleSubject$.subscribe({
      next: (value) => {
        this.simpleSubjectState.set(1);
        this.simpleSubjectText.set(`${changeCount}: ${value}`);
        changeCount++;
      },
      error: (error) => {
        this.simpleSubjectState.set(99);
        this.simpleSubjectText.set(error);
      },
      complete: () => {
        this.simpleSubjectState.set(2);
        this.simpleSubjectText.set('終了（※再利用不可）');
      }
    });
  }

  onClickSendMessageToSimpleSubject(): void {
    this.service.updateSimpleSubject(this.simpleSubjectInputMessagge());
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
          this.behaviorSubjectState.set(1);
        }
        this.behaviorSubjectText.set(`${changeCount}: ${value}`);
        changeCount++;
      },
      complete: () => {
        this.behaviorSubjectState.set(2);
        this.behaviorSubjectText.set('終了（※再利用不可）');
      }
    });
  }

  onClickSendMessageToBehaviorSubject(): void {
    this.service.updateBehaviorSubject(this.behaviorSubjectInputMessagge());
  }

  /**
   * コンポーネント側からもSubjectを完了させることができるが、
   * サービスとの依存関係が強くなるため、基本的にはサービス側で完了させるようにする。
   **/ 
  onClickFinishBehaviorSubject(): void {
    this.service.completeBehaviorSubject();
  }
  //#endregion

  //#region Filter pipe operators
  onClickResetSelectedCrew(): void {
    this.selectedCrewId.set(null);
    this.eventValue.set(null);
    this.isShowTheMan.set(false);
  }

  onSelectionCrewChange(event:MatSelectChange): void {
    this.service.subjectWithPipe$.next(event.value);
  }
  //#endregion
}
