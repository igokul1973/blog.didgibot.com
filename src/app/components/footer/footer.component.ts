import { Component } from '@angular/core';
import packageJson from '../../../../package.json';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: true
})
export class FooterComponent {
    public appVersion: string = packageJson.version;
    public year: number = new Date().getFullYear();
}
