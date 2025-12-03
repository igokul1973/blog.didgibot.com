import { describe, expect, it } from 'vitest';
import { RuDatePipe } from './ru-date.pipe';

describe('RuDatePipe', () => {
    it('create an instance', () => {
        const pipe = new RuDatePipe();
        expect(pipe).toBeTruthy();
    });
});
