import { ArticleService } from '@/app/services/article/article.service';
import { NgClass } from '@angular/common';
import { AfterViewInit, Component, computed, inject, Input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { LanguageEnum } from 'types/translation';

@Component({
    selector: 'app-search-field',
    imports: [FormsModule, MatFormFieldModule, NgClass, MatInputModule, MatIcon, MatIconButton, MatTooltip],
    templateUrl: './search-field.component.html',
    styleUrls: ['./search-field.component.scss']
})
export class SearchFieldComponent implements AfterViewInit {
    @Input() isMobile = false;
    public searchQuery = model<string>('');
    public isExpanded = model<boolean>(false);

    private readonly articleService = inject(ArticleService);
    protected readonly selectedLanguage = this.articleService.selectedLanguage;

    private readonly translations = {
        [LanguageEnum.EN]: {
            placeholder: 'Search (min 3 characters)',
            resetSearch: 'Reset search',
            closeAndResetSearch: 'Close and reset search',
            closeSearch: 'Close search',
            search: 'Search'
        },
        [LanguageEnum.RU]: {
            placeholder: 'Поиск (минимум 3 символа)',
            resetSearch: 'Сбросить поиск',
            closeAndResetSearch: 'Закрыть и сбросить поиск',
            closeSearch: 'Закрыть поиск',
            search: 'Поиск'
        }
    };

    protected readonly t = computed(() => this.translations[this.selectedLanguage()]);

    ngAfterViewInit(): void {
        const observer = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.contentRect.width <= 767) {
                    if (!this.searchQuery() && this.isExpanded()) {
                        this.collapseInput();
                    }
                } else if (this.searchQuery() && !this.isExpanded()) {
                    this.expandInput();
                }
            });
        });

        observer.observe(window.document.body);
    }

    public expandInput() {
        this.isExpanded.set(true);
    }

    private collapseInput() {
        this.isExpanded.set(false);
    }

    public toggleInput() {
        if (this.isExpanded()) {
            this.changeSearchQuery('');
            this.collapseInput();
        } else {
            this.expandInput();
        }
    }

    public changeSearchQuery($event: string) {
        this.searchQuery.set($event);
    }
}
