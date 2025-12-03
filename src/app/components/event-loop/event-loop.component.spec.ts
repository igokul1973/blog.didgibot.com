import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { EventLoopComponent } from './event-loop.component';

describe('EventLoopComponent', () => {
    let component: EventLoopComponent;
    let fixture: ComponentFixture<EventLoopComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EventLoopComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(EventLoopComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
