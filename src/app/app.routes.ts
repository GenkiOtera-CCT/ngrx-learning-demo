import { Routes } from '@angular/router';
import { BasicContentsPageComponent } from './pages/basic-contents.page/basic-contents.page.component';

export const routes: Routes = [
    { path: '', component: BasicContentsPageComponent },
    { path: '**', redirectTo: '' }
];
