import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InitializationService {
    private readonly isInitializedSubject = new BehaviorSubject(false);
    public isInitialized$ = this.isInitializedSubject.asObservable();
    private readonly isAnimationFinishedSubject = new BehaviorSubject(false);
    public isAnimationFinished$ = this.isAnimationFinishedSubject.asObservable();

    setIsInitialized() {
        this.isInitializedSubject.next(true);
    }

    setIsAnimationFinished() {
        this.isAnimationFinishedSubject.next(true);
    }
}
