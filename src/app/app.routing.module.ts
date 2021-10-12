import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { CreateEditPostComponent } from './posts/create-edit-post/create-edit-post.component';
import { DisplayPostsComponent } from './posts/display-posts/display-posts.component';

const routes: Routes = [
  { path: '', component: DisplayPostsComponent },
  {
    path: 'create',
    component: CreateEditPostComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'edit/:id',
    component: CreateEditPostComponent,
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
