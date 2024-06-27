import { Injectable } from '@angular/core';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class PracticeContentsService {
  constructor(
    private repository: RepositoryService
  ) {}
}
