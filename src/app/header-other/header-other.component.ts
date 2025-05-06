import { Component, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'app-header-other',
    templateUrl: './header-other.component.html',
    styleUrls: ['./header-other.component.scss'],
    imports: [HeaderComponent],
    encapsulation: ViewEncapsulation.None
})
export class HeaderOtherComponent {}
