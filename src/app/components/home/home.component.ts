import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil, timer } from 'rxjs';
import { ArticleService } from 'src/app/services/article/article.service';
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
    public isAnimationFinished$: Observable<boolean> = this.initializationService.isAnimationFinished$;
    public articles$ = this.articleService.getArticles();
    private readonly unsubscribed$ = new Subject<void>();

    constructor(
        private readonly initializationService: InitializationService,
        private readonly articleService: ArticleService
    ) {}

    ngOnInit(): void {
        timer(9000)
            .pipe(takeUntil(this.unsubscribed$))
            .subscribe(() => {
                this.initializationService.setIsAnimationFinished();
            });
    }

    ngOnDestroy(): void {
        // If this component is destroyed, it was initialized.
        // It means that animation has already played out (even if partially)
        // and there is no need to play it again.
        this.initializationService.setIsAnimationFinished();
        this.unsubscribed$.next();
        this.unsubscribed$.complete();
    }
}
