import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatSlideToggleModule,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {

  isSubscribing: boolean = false;
  isMultiSubscribing: boolean = false;
  simpleObserveText: string;
  anotherSimpleObserveText: string;

  constructor(
    // 待機時間を同期するために敢えてpublicにしているので、参考にしないように。
    public service: AppService
  ) {
    this.simpleObserveText = service.initialText;
    this.anotherSimpleObserveText = `マルチ：${service.initialText}`;
  }
  
  onClickStartSimpleObserve(): void {
    // subscribeすることでObservableが動き出す
    this.service.simpleObservable$.subscribe({
      next: (value) => {
        this.isSubscribing = true;
        this.simpleObserveText = value;
      },
      complete: () => {
        this.isSubscribing = false;
        this.simpleObserveText = this.service.initialText;
      }
    });
    // このようにsubscribeすると、同じObservableを複数回subscribeすることができる。
    if(this.isMultiSubscribing) {
      this.service.simpleObservable$.subscribe({
        next: (value) => {
          this.anotherSimpleObserveText = `マルチ -> ${value}`;
        },
        complete: () => {
          this.anotherSimpleObserveText = `マルチ：${this.service.initialText}`;
        }
      });
    }
  }
}
