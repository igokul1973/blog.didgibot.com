import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { first, Observable, timer } from 'rxjs';
import { ArticleService } from 'src/app/services/article/article.service';
import { ISortInput } from 'types/article';
import { InitializationService } from '../../services/initialization/initialization.service';
import { ArticleComponent } from '../article/article.component';
import { IntroComponent } from '../intro/intro.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [CommonModule, IntroComponent, ArticleComponent],
    standalone: true
})
export class HomeComponent implements OnInit, OnDestroy {
    private readonly initializationService = inject(InitializationService);
    private readonly articleService = inject(ArticleService);
    public isAnimationFinished$: Observable<boolean> = this.initializationService.isAnimationFinished$;
    private readonly sort: ISortInput = { field: 'updated_at', dir: 'desc' };
    public articles = this.articleService.homePageArticles;
    protected selectedLanguage = this.articleService.selectedLanguage;

    ngOnInit(): void {
        timer(9000)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.initializationService.setIsAnimationFinished();
                }
            });
    }

    ngOnDestroy(): void {
        // If this component is destroyed, it was initialized.
        // It means that animation has already played out (even if partially)
        // and there is no need to play it again.
        this.initializationService.setIsAnimationFinished();
    }
}
