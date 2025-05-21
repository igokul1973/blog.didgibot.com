import { NgClass } from '@angular/common';
import { Component, Input, model } from '@angular/core';
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
    public search = '';
    public searchQuery = model<string>('');
    public isExpanded = false;

    public expandInput() {
        this.isExpanded = true;
    }

    private collapseInput() {
        this.isExpanded = false;
    }

    public toggleInput() {
        if (this.isExpanded) {
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
