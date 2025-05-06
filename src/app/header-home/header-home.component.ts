import { Component, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'app-header',
    templateUrl: './header-home.component.html',
    styleUrls: ['./header-home.component.scss'],
    imports: [HeaderComponent],
    standalone: true,
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {}
