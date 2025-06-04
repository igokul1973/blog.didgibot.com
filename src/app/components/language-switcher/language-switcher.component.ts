import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LanguageEnum } from 'types/translation';

@Component({
    selector: 'app-language-switcher',
    templateUrl: './language-switcher.component.html',
    styleUrl: './language-switcher.component.scss',
    imports: [FormsModule, MatSelectModule, MatFormFieldModule, MatInputModule]
})
export class LanguageSwitcherComponent {
    protected languageEnum = LanguageEnum;
    public selectedLanguage = model(this.languageEnum.EN);
}
