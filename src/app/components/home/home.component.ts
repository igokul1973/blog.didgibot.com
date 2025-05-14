import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
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
export class HomeComponent implements OnDestroy {
    public isAnimationFinished$: Observable<boolean> = this.initializationService.isAnimationFinished$;
    public articles$ = this.articleService.getArticles();

    constructor(
        private readonly initializationService: InitializationService,
        private readonly articleService: ArticleService
    ) {}

    ngOnDestroy(): void {
        // If this component is destroyed, it was initialized.
        // It means that animation has already played out (even if partially)
        // and there is no need to play it again.
        this.initializationService.setIsAnimationFinished();
    }
}
