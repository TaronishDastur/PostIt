import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app.routing.module';
import { AuthenticationInterceptor } from './authentication/authentication-interceptor';
import { ErrorInterceptor } from './app/error-interceptor';
import { ErrorsComponent } from './errors/errors.component';
import { MaterialModule } from './material.module';
import { PostModule } from './posts/post.module';
import { AuthenticationModule } from './authentication/authentication.module';

@NgModule({
  declarations: [AppComponent, HeaderComponent, ErrorsComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    PostModule,
    AuthenticationModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
