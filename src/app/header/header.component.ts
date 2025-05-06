import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { InitializationService } from '../initialization.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatToolbar, MatListModule],
    standalone: true
})
export class HeaderComponent {
    public isOpen = false;
    public animationFinished$: Observable<boolean> = this.initializationService.animationFinished$;
    @Input() isHome?: boolean;

    constructor(private readonly initializationService: InitializationService) {}
    toggleTabletMenu() {
        this.isOpen = !this.isOpen;
    }

    ngOnDestroy(): void {
        // If this component is destroyed, it was initialized.
        // It means that animation has already played out (even if partially)
        // and there is no need to play it again.
        this.initializationService.setAnimationFinished();
    }
}
