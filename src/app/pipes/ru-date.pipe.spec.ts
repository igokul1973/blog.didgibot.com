import { RuDatePipe } from './ru-date.pipe';

describe('RuDatePipe', () => {
    it('create an instance', () => {
        const pipe = new RuDatePipe();
        expect(pipe).toBeTruthy();
    });

    it('returns empty string when date is undefined', () => {
        const pipe = new RuDatePipe();

        const result = pipe.transform(undefined);

        expect(result).toBe('');
    });

    it('formats date with Russian month name and year', () => {
        const pipe = new RuDatePipe();
        const date = new Date(2023, 0, 15); // 15 января 2023

        const result = pipe.transform(date);

        expect(result).toBe('15 января 2023');
    });
});
