import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onLogin(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;
    
    this.loading = true;
    this.errorMsg = '';
    
    const { email, password } = this.loginForm.value;
    
    this.authService.login({ email, password }).subscribe({
      next: res => {
        if (res.status === 'success') {
          this.toast.success('Welcome back, ' + res.data.firstName + '!');
          if (res.data.role === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.errorMsg = res.message || 'Login failed';
          this.loading = false;
        }
      },
      error: err => {
        this.errorMsg = err.error?.message || 'Invalid email or password';
        this.loading = false;
      }
    });
  }
}
