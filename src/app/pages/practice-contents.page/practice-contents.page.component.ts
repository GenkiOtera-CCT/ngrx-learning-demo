import { Component } from '@angular/core';
import { PracticeContentsService } from '../../services/practice-contents.service';
import { MatButtonModule } from '@angular/material/button';
import { MessageResponse } from '../../interfaces/api';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DisplayId } from '../../interfaces';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-practice-contents.page',
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatRadioModule,
        MatInputModule,
    ],
    templateUrl: './practice-contents.page.component.html',
    styleUrls: ['./practice-contents.page.component.css']
})
export class PracticeContentsPageComponent {

  requestStatuses: string[] = [];
  successRate: number = 0;

  modelA$ = this.service.modelA$;
  modelB$ = this.service.modelB$;
  displayableParentIds$:Observable<DisplayId[]> = this.service.getDisplayableParentIds();
  displayableChildIds$:Observable<DisplayId[]> = this.service.getDisplayableChildIds();

  addingParentId: number = 0;
  addingChildId: number = 0;
  addingDisableId: number = 0;
  addingHiddenId: number = 0;

  constructor(
    private service: PracticeContentsService
  ) {}

  //#region HTTP
  onClickShortTimeRequestButton() : void {
    this.requestStatuses = [];
    this.requestStatuses.push(`リクエスト送信（ショート）`);
    this.service.getShortTimeRequest().subscribe({
      next: (response:MessageResponse) => {
        this.requestStatuses.push(`レスポンス到着（ショート）: ${response.message}`);
      },
      complete: () => this.requestStatuses.push('リクエスト完了（ショート）')
    }
  );
  }

  onClickLongTimeRequestButton() : void {
    this.requestStatuses = [];
    this.requestStatuses.push('リクエスト送信（ロング）');
    this.service.getLongTimeRequest().subscribe({
      next: (response:MessageResponse) => {
        this.requestStatuses.push(`レスポンス到着（ロング）: ${response.message}`);
      },
      complete: () => this.requestStatuses.push('リクエスト完了（ロング）')
    });
  }

  onClickOrderedRequestButton() : void {
    this.requestStatuses = [];
    this.requestStatuses.push('リクエスト送信（順序）');
    let count: number = 1;
    this.service.getOrderedRequest().subscribe({
      next: (response:MessageResponse) => {
        this.requestStatuses.push(`レスポンス到着（${count}つ目）: ${response.message}`);
        count++;
      },
      complete: () => this.requestStatuses.push('リクエスト完了（順序）')
    });
  }

  onClickJoinedRequestButton() : void {
    this.requestStatuses = [];
    this.requestStatuses.push('リクエスト送信（結合）');
    this.service.getJoinedRequest().subscribe({
      next: (responses:[MessageResponse, MessageResponse]) => {
        const combinedMessage = responses.map((response) => response.message).join(' & ');
        this.requestStatuses.push(`レスポンス到着（まとめて）: ${combinedMessage}`);
      },
      complete: () => this.requestStatuses.push('リクエスト完了（結合）')
    });
  }

  onClickErrorRequestButton() : void {
    this.requestStatuses = [];
    this.requestStatuses.push('リクエスト送信（エラー）');
    this.service.getErrorRequest().subscribe({
      next: (response:any) => {
        this.requestStatuses.push(`レスポンス到着（エラー）: ${response.message}`);
      },
      error: () => this.requestStatuses.push('エラー発生'),
      complete: () => this.requestStatuses.push('リクエスト完了（エラー）')
    });
  }

  onClickFragileRequestButton(withRetry:boolean = false) : void {
    this.requestStatuses = [];
    this.requestStatuses.push('リクエスト送信（不安定）');
    if (withRetry) {
      this.service.getErrorRequestWithRetry(this.successRate).subscribe({
        next: (response:MessageResponse) => {
          this.requestStatuses.push(`レスポンス到着（不安定）: ${response.message}`);
        },
        error: () => this.requestStatuses.push('エラー発生'),
        complete: () => this.requestStatuses.push('リクエスト完了（不安定）')
      });
    } else {
      this.service.getFragileRequest(this.successRate).subscribe({
        next: (response:MessageResponse) => {
          this.requestStatuses.push(`レスポンス到着（不安定）: ${response.message}`);
        },
        error: () => this.requestStatuses.push('エラー発生'),
        complete: () => this.requestStatuses.push('リクエスト完了（不安定）')
      });
    }
  }
  //#endregion

  //#region Model Display
  onClickAddIdButton(idType:string) : void {
    switch (idType) {
      case 'parent':
        this.service.addParentId(this.addingParentId);
        break;
      case 'child':
        if(this.addingChildId < 1) return;
        this.service.addChildId(this.addingChildId);
        break;
      case 'disable':
        if(this.addingDisableId < 1) return;
        this.service.addDisableId(this.addingDisableId);
        break;
      case 'hidden':
        if(this.addingHiddenId < 1) return;
        this.service.addHiddenId(this.addingHiddenId);
        break;
    }
  }

  onClickRemoveIdButton(idType:string, value:number) : void {
    switch (idType) {
      case 'parent':
        this.service.removeParentId(value);
        break;
      case 'child':
        this.service.removeChildId(value);
        break;
      case 'disable':
        this.service.removeDisableId(value);
        break;
      case 'hidden':
        this.service.removeHiddenId(value);
        break;
    }
  }
  //#endregion
}
