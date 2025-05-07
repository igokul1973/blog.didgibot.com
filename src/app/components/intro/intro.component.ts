import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-intro',
    imports: [CommonModule, RouterModule, MatCardModule, MatDividerModule],
    templateUrl: './intro.component.html',
    styleUrl: './intro.component.scss'
})
export class IntroComponent {
    @Input() isAnimationFinished: boolean = false;
}
