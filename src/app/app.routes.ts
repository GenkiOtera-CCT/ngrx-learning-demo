import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./pages/basic-contents.page/basic-contents.page.component').then(m => m.BasicContentsPageComponent) },
    { path: 'practice', loadComponent: () => import('./pages/practice-contents.page/practice-contents.page.component').then(m => m.PracticeContentsPageComponent) },
    { path: '**', redirectTo: '' }
];
