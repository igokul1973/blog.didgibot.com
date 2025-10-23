import { ArticlePageComponent } from '@/app/components/article-page/article-page.component';
import { PageNotFoundComponent } from '@/app/components/page-not-found/page-not-found.component';
import { Routes } from '@angular/router';
import { EventLoopComponent } from './components/event-loop/event-loop.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'en',
        pathMatch: 'full'
    },
    {
        path: ':language',
        children: [
            {
                path: 'blog',
                children: [
                    {
                        path: 'article/:id',
                        component: ArticlePageComponent,
                        title: 'Article',
                        pathMatch: 'full',
                        data: {
                            name: 'blog article'
                        }
                    },
                    {
                        path: '',
                        loadComponent: () =>
                            import('@/app/components/blog/blog.component').then((m) => m.BlogComponent),
                        title: 'Blog',
                        pathMatch: 'full',
                        data: {
                            name: 'blog'
                        }
                    },
                    {
                        path: 'event-loop',
                        component: EventLoopComponent,
                        title: 'Event Loop',
                        data: {
                            name: 'event loop'
                        }
                    }
                ]
            },
            {
                path: 'cv',
                loadComponent: () => import('@/app/components/cv/cv.component').then((m) => m.CvComponent),
                title: 'Curriculum Vitae',
                data: {
                    name: 'cv'
                }
            },
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
                path: '**',
                component: PageNotFoundComponent,
                title: '404 - Page not found',
                data: {
                    name: 'page not found'
                }
            }
        ]
    },
    {
        path: '**',
        component: PageNotFoundComponent,
        title: '404 - Page not found',
        data: {
            name: 'page not found'
        }
    }
];
