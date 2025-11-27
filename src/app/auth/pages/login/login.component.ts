import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@auth/services';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { getErrorMessage } from '@shared/utils/error-parser';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputText, FloatLabel, Button, Message],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
})
export class LoginComponent implements OnInit {
  public form!: FormGroup;

  protected readonly getErrorMessage = getErrorMessage;

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
    });
  }

  public async login(): Promise<void> {
    this.authService.login(this.form.getRawValue());
    await this.router.navigate(['']);
  }
}
