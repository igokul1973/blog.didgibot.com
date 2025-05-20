import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-intro',
    imports: [CommonModule, MatIcon, RouterLink, MatCardModule, MatDividerModule, MatButton],
    templateUrl: './intro.component.html',
    styleUrl: './intro.component.scss'
})
export class IntroComponent {
    @Input() isAnimationFinished: boolean = false;
}
