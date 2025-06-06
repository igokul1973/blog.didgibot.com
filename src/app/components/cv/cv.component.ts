import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-cv',
    imports: [MatCardModule],
    templateUrl: './cv.component.html',
    styleUrl: './cv.component.scss'
})
export class CvComponent {}
