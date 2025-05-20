import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
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
    searchQuery = signal('');
    isExpanded = false;

    public expandInput() {
        this.isExpanded = true;
    }

    public collapseInput() {
        this.isExpanded = false;
    }

    public toggleInput() {
        this.isExpanded = !this.isExpanded;
    }

    search() {
        // Perform search logic here
        console.log('Searching...');
    }
}
