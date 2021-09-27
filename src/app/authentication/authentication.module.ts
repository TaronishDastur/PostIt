import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app.routing.module';
import { MaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { LoginSignupFormComponent } from './components/login-signup-form/login-signup-form.component';
import { SignupComponent } from './signup/signup.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';

@NgModule({
  declarations: [LoginComponent, LoginSignupFormComponent, SignupComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    AuthenticationRoutingModule,
  ],
})
export class AuthenticationModule {}
