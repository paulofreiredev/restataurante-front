import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly TOKEN_KEY = 'admin_token';
  private _isLoggedIn = signal(localStorage.getItem(this.TOKEN_KEY) === 'valid');
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem(this.TOKEN_KEY, 'valid');
      this._isLoggedIn.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this._isLoggedIn.set(false);
  }
}
