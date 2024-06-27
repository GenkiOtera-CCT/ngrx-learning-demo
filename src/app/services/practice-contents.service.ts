import { Injectable } from '@angular/core';
import { RepositoryService } from './repository.service';
import { BehaviorSubject, Observable, combineLatest, concat, forkJoin, map, retry } from 'rxjs';
import { MessageResponse } from '../interfaces/api';
import { DisplayId, ModelA, ModelB } from '../interfaces/';

@Injectable({
  providedIn: 'root'
})
export class PracticeContentsService {

  modelA$ = new BehaviorSubject<ModelA>({
    id: 17,
    type: 'Main',
    parentIds: [1, 4, 5, 9],
    chiledIds: [31, 37, 55, 63, 73, 89],
    isDeleted: false
  });

  modelB$ = new BehaviorSubject<ModelB>({
    id: 439,
    type: 'Sub',
    disableIds: [4, 9, 37],
    hiddenIds: [1, 55, 63, 73],
    isDeleted: false
  });

  constructor(
    private repository: RepositoryService
  ) {}
  //#region HTTP
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
  //#endregion

  addParentId(value:number) : void {
    // 重複チェック
    const currentModelA = this.modelA$.getValue();
    if(currentModelA.parentIds.includes(value)) return;
    // 追加
    this.modelA$.next({
      ...this.modelA$.value,
      parentIds: [...this.modelA$.value.parentIds, value]
    });
  }

  removeParentId(value:number) : void {
    // 削除
    this.modelA$.next({
      ...this.modelA$.value,
      parentIds: this.modelA$.value.parentIds.filter((id:number) => id !== value)
    });
  }

  addChildId(value:number) : void {
    // 重複チェック
    const currentModelA = this.modelA$.getValue();
    if(currentModelA.chiledIds.includes(value)) return;
    // 追加
    this.modelA$.next({
      ...this.modelA$.value,
      chiledIds: [...this.modelA$.value.chiledIds, value]
    });
  }

  removeChildId(value:number) : void {
    // 削除
    this.modelA$.next({
      ...this.modelA$.value,
      chiledIds: this.modelA$.value.chiledIds.filter((id:number) => id !== value)
    });
  }

  addDisableId(value:number) : void {
    // 重複チェック
    const currentModelB = this.modelB$.getValue();
    if(currentModelB.disableIds.includes(value)) return;
    // 追加
    this.modelB$.next({
      ...this.modelB$.value,
      disableIds: [...this.modelB$.value.disableIds, value]
    });
  }

  removeDisableId(value:number) : void {
    // 削除
    this.modelB$.next({
      ...this.modelB$.value,
      disableIds: this.modelB$.value.disableIds.filter((id:number) => id !== value)
    });
  }

  addHiddenId(value:number) : void {
    // 重複チェック
    const currentModelB = this.modelB$.getValue();
    if(currentModelB.hiddenIds.includes(value)) return;
    // 追加
    this.modelB$.next({
      ...this.modelB$.value,
      hiddenIds: [...this.modelB$.value.hiddenIds, value]
    });
  }

  removeHiddenId(value:number) : void {
    // 削除
    this.modelB$.next({
      ...this.modelB$.value,
      hiddenIds: this.modelB$.value.hiddenIds.filter((id:number) => id !== value)
    });
  }

  getDisplayableParentIds() : Observable<DisplayId[]> {
    return combineLatest([this.modelA$, this.modelB$]).pipe(
      map(([modelA, modelB]) => {
        return modelA.parentIds.map((id:number) => {
          return {
            id: id,
            isDisabled: modelB.disableIds.includes(id),
            isHidden: modelB.hiddenIds.includes(id)
          } as DisplayId;
        }).filter((id:DisplayId) => !id.isHidden);
      }),
    );
  }

  getDisplayableChildIds() : Observable<DisplayId[]> {
    return combineLatest([this.modelA$, this.modelB$]).pipe(
      map(([modelA, modelB]) => {
        return modelA.chiledIds.map((id:number) => {
          return {
            id: id,
            isDisabled: modelB.disableIds.includes(id),
            isHidden: modelB.hiddenIds.includes(id)
          } as DisplayId;
        }).filter((id:DisplayId) => !id.isHidden);
      }),
    );
  }
}
