import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { InitializationService } from '../../services/initialization/initialization.service';
import { SearchFieldComponent } from '../search-field/search-field.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        MatButtonModule,
        MatIconModule,
        MatToolbar,
        MatListModule,
        SearchFieldComponent
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: true
})
export class HeaderComponent {
    public isOpen = false;
    public isAnimationFinished$: Observable<boolean> = this.initializationService.isAnimationFinished$;
    @Input() isHome?: boolean;

    constructor(private readonly initializationService: InitializationService) {}
    toggleTabletMenu() {
        this.isOpen = !this.isOpen;
    }

    ngOnDestroy(): void {
        // If this component is destroyed, it was initialized.
        // It means that animation has already played out (even if partially)
        // and there is no need to play it again.
        this.initializationService.setIsAnimationFinished();
    }
}
