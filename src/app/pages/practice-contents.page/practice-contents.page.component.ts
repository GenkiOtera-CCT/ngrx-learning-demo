import { Component } from '@angular/core';
import { PracticeContentsService } from '../../services/practice-contents.service';

@Component({
  selector: 'app-practice-contents.page',
  standalone: true,
  imports: [],
  templateUrl: './practice-contents.page.component.html',
  styleUrls: ['./practice-contents.page.component.css']
})
export class PracticeContentsPageComponent {

  constructor(
    private service: PracticeContentsService
  ) {}
}
