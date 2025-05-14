import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Home',
        data: {
            name: 'home'
        }
    },
    {
        path: 'blog',
        loadComponent: () => import('./components/blog/blog.component').then((m) => m.BlogComponent),
        title: 'Blog',
        data: {
            name: 'blog'
        }
    },
    {
        path: '**',
        component: PageNotFoundComponent,
        title: 'Page not found',
        data: {
            name: 'blog'
        }
    }
];
