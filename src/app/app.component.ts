import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {

  isSubscribing: boolean = false;
  simpleObserveText: string;

  constructor(
    // 待機時間を同期するために敢えてpublicにしているので、参考にしないように。
    public service: AppService
  ) {
    this.simpleObserveText = service.initialText;
  }
  
  onClickStartSimpleObserve(): void {
    this.service.simpleManObservable$.subscribe({
      next: (value) => {
        this.isSubscribing = true;
        this.simpleObserveText = value;
      },
      complete: () => {
        this.isSubscribing = false;
        this.simpleObserveText = this.service.initialText;
      }
    });
  }
}
