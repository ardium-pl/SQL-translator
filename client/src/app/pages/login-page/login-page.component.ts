import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ButtonComponent } from '../../components/button/button.component';
import { CardComponent } from '../../components/card/card.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CardComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  readonly authService = inject(AuthService);
  readonly loginForm = new FormGroup({
    passwordInput: new FormControl('klucz dostępu'),
  });

  submitPassword() {
    const userInput = this.loginForm.value.passwordInput || '';
    if (!userInput) {
      console.log('No password provided.');
    } else {
      console.log(`Submitted password: ${userInput}`);
      this.authService.login(userInput);
    }
  }
}
