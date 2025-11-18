import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Login } from '@auth/models';
import { token_cookie } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly cookiesService: CookieService = inject(CookieService);

  public login(body: Login): void {
    const token: number = Math.random();
    this.cookiesService.set(token_cookie, `${token}`);
  }
}
