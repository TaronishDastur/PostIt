import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { DisplayPostsComponent } from './posts/display-posts/display-posts.component';

const routes: Routes = [
  { path: '', component: DisplayPostsComponent },
  {
    path: 'create',
    component: CreatePostComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'edit/:id',
    component: CreatePostComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthenticationGuard],
})
export class AppRoutingModule {}
