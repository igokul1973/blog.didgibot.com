import { NgClass } from '@angular/common';
import { Component, Input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
    selector: 'app-search-field',
    imports: [FormsModule, MatFormFieldModule, NgClass, MatInputModule, MatIcon, MatIconButton, MatTooltip],
    templateUrl: './search-field.component.html',
    styleUrl: './search-field.component.scss'
})
export class SearchFieldComponent {
    @Input() isMobile: boolean = false;
    public searchQuery = model<string>('');
    public isExpanded = signal<boolean>(false);

    ngAfterViewInit(): void {
        const observer = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.contentRect.width <= 767) {
                    if (!this.searchQuery()) {
                        this.isExpanded() && this.collapseInput();
                    }
                } else {
                    this.searchQuery() && !this.isExpanded() && this.expandInput();
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
