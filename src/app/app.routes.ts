import { Routes } from '@angular/router';
import { BasicContentsPageComponent } from './pages/basic-contents.page/basic-contents.page.component';
import { PracticeContentsPageComponent } from './pages/practice-contents.page/practice-contents.page.component';

export const routes: Routes = [
    { path: '', component: BasicContentsPageComponent },
    { path: 'practice', component: PracticeContentsPageComponent },
    { path: '**', redirectTo: '' }
];
