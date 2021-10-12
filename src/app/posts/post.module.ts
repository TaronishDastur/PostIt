import { NgModule } from '@angular/core';
import { CreateEditPostComponent } from './create-edit-post/create-edit-post.component';
import { DisplayPostsComponent } from './display-posts/display-posts.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app.routing.module';
import { MaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CreateEditPostComponent, DisplayPostsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
  ],
})
export class PostModule {}
