import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InitializationService {
    private initializedSubject = new BehaviorSubject(false);
    public initialized$ = this.initializedSubject.asObservable();
    private animationFinishedSubject = new BehaviorSubject(false);
    public animationFinished$ = this.animationFinishedSubject.asObservable();

    setInitialized() {
        this.initializedSubject.next(true);
    }

    setAnimationFinished() {
        this.animationFinishedSubject.next(true);
    }
}
