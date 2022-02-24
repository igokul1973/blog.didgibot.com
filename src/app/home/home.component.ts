import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { InitializationService } from '../initialization.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {
    public animationFinished$: Observable<boolean> = this.initializationService.animationFinished$;

    constructor(private initializationService: InitializationService) {}

    ngOnDestroy(): void {
        // If this component is destroyed, it was initialized.
        // It means that animation has already played out (even if partially)
        // and there is no need to play it again.
        this.initializationService.setAnimationFinished();
    }
}
