import { Component } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss'],
    imports: [RouterModule, MatCardModule, MatFabButton],
    standalone: true
})
export class PageNotFoundComponent {}
