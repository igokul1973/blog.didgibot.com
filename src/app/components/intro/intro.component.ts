import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-intro',
    imports: [CommonModule, MatFabButton, MatIconModule, RouterModule, MatCardModule, MatDividerModule],
    templateUrl: './intro.component.html',
    styleUrl: './intro.component.scss'
})
export class IntroComponent {
    @Input() isAnimationFinished: boolean = false;
}
