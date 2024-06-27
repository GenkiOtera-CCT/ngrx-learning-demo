import { Component } from '@angular/core';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonToggleModule,
  ],
  providers: [],
  template: `
    <header>
      <mat-toolbar>
        <span>NgrxLearningDemo</span>
        <div class="spacer"></div>
        <mat-button-toggle-group
          [value]="selectedChildRoute"
          [hideSingleSelectionIndicator]="true"
          (change)="onChangeChildRoute($event)"
        >
          @for (childRoute of childRoutes; track childRoute) {
            <mat-button-toggle [value]="childRoute">{{ childRoute }}</mat-button-toggle>
          }
        </mat-button-toggle-group>
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
  
  childRoutes: string[] = [
    'basic',
    'practice',
  ];
  selectedChildRoute: string;

  constructor(
    private router: Router
  ) {
    const paths:string[] = window.location.href.split('/');
    const lastPath:string = paths[paths.length - 1];
    this.selectedChildRoute = this.childRoutes.includes(lastPath) ? lastPath : this.childRoutes[0];
  }

  onChangeChildRoute(event: MatButtonToggleChange) {
    this.router.navigate([`/${event.value}`]);
  }
}
