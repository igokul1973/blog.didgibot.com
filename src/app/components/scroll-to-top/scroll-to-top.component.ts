import { AfterViewInit, Component } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-scroll-to-top',
    templateUrl: './scroll-to-top.component.html',
    styleUrl: './scroll-to-top.component.scss',
    imports: [MatFabButton, MatIcon]
})
export class ScrollToTopComponent implements AfterViewInit {
    protected showButton = false;

    ngAfterViewInit() {
        window.addEventListener('scroll', this.checkScrollPosition.bind(this));
    }

    checkScrollPosition() {
        const scrollPosition = window.scrollY;
        this.showButton = scrollPosition > 200; // adjust the threshold value as needed
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
