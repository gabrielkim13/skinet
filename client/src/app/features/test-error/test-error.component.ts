import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

import { MatButton } from '@angular/material/button';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-test-error',
  standalone: true,
  imports: [MatButton],
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.scss',
})
export class TestErrorComponent {
  private static readonly BASE_URL = environment.apiUrl;

  validationErrors?: string[];

  constructor(private readonly http: HttpClient) {}

  get400Error() {
    this.http.get(`${TestErrorComponent.BASE_URL}/buggy/badrequest`).subscribe({
      next: console.log,
      error: console.error,
    });
  }

  get401Error() {
    this.http
      .get(`${TestErrorComponent.BASE_URL}/buggy/unauthorized`)
      .subscribe({
        next: console.log,
        error: console.error,
      });
  }

  get404Error() {
    this.http.get(`${TestErrorComponent.BASE_URL}/buggy/not-found`).subscribe({
      next: console.log,
      error: console.error,
    });
  }

  get500Error() {
    this.http
      .get(`${TestErrorComponent.BASE_URL}/buggy/internalerror`)
      .subscribe({
        next: console.log,
        error: console.error,
      });
  }

  get400ValidationError() {
    this.http
      .post(`${TestErrorComponent.BASE_URL}/buggy/validationerror`, {})
      .subscribe({
        next: console.log,
        error: (error) => (this.validationErrors = error),
      });
  }
}
