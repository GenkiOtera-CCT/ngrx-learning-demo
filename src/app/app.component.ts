import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  providers: [],
  template: `<main><router-outlet></router-outlet></main>`
})
export class AppComponent {

  constructor() {}

}
