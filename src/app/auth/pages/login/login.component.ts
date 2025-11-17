import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@auth/services';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
})
export class LoginComponent implements OnInit {
  public form!: FormGroup;

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly authService: AuthService = inject(AuthService);

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [null, Validators.required, Validators.email],
      password: [null, Validators.required, Validators.min(8)],
    });
  }

  public login(): void {
    this.authService.login(this.form.getRawValue());
  }
}
