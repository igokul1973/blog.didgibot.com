import { CommonModule } from '@angular/common';
import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { InitializationService } from '../initialization.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [CommonModule, RouterModule, MatCardModule, MatDivider, MatButtonModule],
    // encapsulation: ViewEncapsulation.None,
    standalone: true
})
export class HomeComponent implements OnDestroy {
    public animationFinished$: Observable<boolean> = this.initializationService.animationFinished$;

    constructor(private readonly initializationService: InitializationService) {}

    ngOnDestroy(): void {
        // If this component is destroyed, it was initialized.
        // It means that animation has already played out (even if partially)
        // and there is no need to play it again.
        this.initializationService.setAnimationFinished();
    }
}
