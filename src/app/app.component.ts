import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
  ],
  providers: [],
  template: `
    <header>
      <mat-toolbar>
        <span>NgrxLearningDemo</span>
        <div class="spacer"></div>
        @for (childRoute of childRoutes; track childRoute) {
          <a href="{{childRoute}}">・{{ childRoute }}</a>
        }
      </mat-toolbar>
    </header>
    <main>
      <router-outlet/>
    </main>
  `,
  styles: [`
    mat-toolbar {
      display: flex;
      gap: 10px;
      align-items: center;
      background-color: #d81b60;
      color: white;
    }
    main {
      flex: 1;
      overflow: auto;
    }
  `]
})
export class AppComponent {

  constructor() {}

  childRoutes: string[] = [
    'basic',
    'practice',
  ];
}
