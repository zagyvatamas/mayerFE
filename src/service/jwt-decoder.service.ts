import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtDecoderService {

  private base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
      str += '=';
    }
    const decoded = atob(str);
    try {
      return decodeURIComponent(
        decoded
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch {
      return decoded;
    }
  }

  decodeToken(token: string): { header: any; payload: any } | null {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Érvénytelen JWT token');
      return null;
    }

    try {
      const headerJson = this.base64UrlDecode(parts[0]);
      const payloadJson = this.base64UrlDecode(parts[1]);

      const header = JSON.parse(headerJson);
      const payload = JSON.parse(payloadJson);

      return { header, payload };
    } catch (e) {
      console.error('Hiba a JWT dekódolása közben:', e);
      return null;
    }
  }

  getTokenFromLocalStorage(key: string = 'jwtToken'): string | null {
    return localStorage.getItem(key);
  }

  decodeTokenFromLocalStorage(key: string = 'jwtToken') {
    const token = this.getTokenFromLocalStorage(key);
    return this.decodeToken(token!);
  }

  getUsernameFromToken(key: string = 'token'): string | null {
  const token = this.getTokenFromLocalStorage(key);
  if (!token) return null;

  const decoded = this.decodeToken(token);
  if (!decoded || !decoded.payload) return null;

  return decoded.payload.username ?? decoded.payload.sub ?? null;
}
}
