import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  openErrorSnackBar() : void {
    this.snackBar.open(
      'エラーが発生しました', 
      undefined,
      { duration: 2000 }
    );
  }
}
