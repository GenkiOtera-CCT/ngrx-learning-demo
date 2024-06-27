import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';
import { ErrorService } from '../services/error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService: ErrorService = inject(ErrorService);
  return next(req).pipe(
    catchError((error) => {
      errorService.openErrorSnackBar();
      throw error;
    }
  ));
};
