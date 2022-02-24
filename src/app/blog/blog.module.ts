import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
    declarations: [BlogComponent],
    imports: [CommonModule, BlogRoutingModule, MaterialModule]
})
export class BlogModule {}
