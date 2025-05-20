import { ArticlePageComponent } from '@/app/components/article-page/article-page.component';
import { HomeComponent } from '@/app/components/home/home.component';
import { PageNotFoundComponent } from '@/app/components/page-not-found/page-not-found.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Home',
        pathMatch: 'full',
        data: {
            name: 'home'
        }
    },
    {
        path: 'blog/article/:id',
        component: ArticlePageComponent,
        title: 'Article',
        pathMatch: 'full',
        data: {
            name: 'blog'
        }
    },
    {
        path: 'blog',
        loadComponent: () => import('@/app/components/blog/blog.component').then((m) => m.BlogComponent),
        title: 'Blog',
        pathMatch: 'full',
        data: {
            name: 'blog'
        },
        children: [
            {
                path: 'article/:id',
                component: ArticlePageComponent,
                title: 'Article',
                pathMatch: 'full',
                data: {
                    name: 'blog'
                }
            }
        ]
    },
    {
        path: '**',
        component: PageNotFoundComponent,
        title: '404 - Page not found',
        data: {
            name: 'blog'
        }
    }
];
