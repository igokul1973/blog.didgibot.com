import { Pipe, PipeTransform } from '@angular/core';

enum MonthsEnum {
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря'
}

@Pipe({
    name: 'ruDate'
})
export class RuDatePipe implements PipeTransform {
    transform(date: Date | undefined) {
        if (!date) {
            return '';
        }
        const dateOfMonth = date.getDate();
        const nameOfMonth = MonthsEnum[date.getMonth()];
        const year = date.getFullYear();

        return dateOfMonth + ' ' + nameOfMonth + ' ' + year;
    }
}
