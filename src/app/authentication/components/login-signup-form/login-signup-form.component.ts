import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-login-signup-form',
  templateUrl: './login-signup-form.component.html',
  styleUrls: ['./login-signup-form.component.scss'],
})
export class LoginSignupFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() loading: Boolean;
  @Input() login: Boolean;
  @Output() submit = new EventEmitter<boolean>();
  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.login
      ? this.authService.login(
          this.form.controls.email.value,
          this.form.controls.password.value
        )
      : this.authService.addUser(
          this.form.controls.email.value,
          this.form.controls.password.value
        );
  }
}
