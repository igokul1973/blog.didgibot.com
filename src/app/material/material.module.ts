import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

const modules = [MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule, MatDividerModule, MatListModule];

@NgModule({
    imports: [modules],
    exports: [modules]
})
export class MaterialModule {}
