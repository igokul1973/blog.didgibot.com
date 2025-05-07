import { Component } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss'],
    imports: [MatCardModule, MatDivider],
    standalone: true
})
export class PageNotFoundComponent {}
