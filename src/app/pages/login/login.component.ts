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
  otpForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  otpSubmitted: boolean = false;
  errorMsg: string = '';
  step: 'credentials' | 'otp' = 'credentials';
  otpEmail: string = '';
  resendCooldown: number = 0;
  private resendTimer: any;

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

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]{6}$')]]
    });
  }

  get f() { return this.loginForm.controls; }
  get o() { return this.otpForm.controls; }

  /** Step 1: validate credentials and send OTP */
  onSendOtp(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMsg = '';

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: res => {
        if (res.status === 'success') {
          this.otpEmail = res.data.email;
          this.step = 'otp';
          this.toast.success('OTP sent to your email!');
          this.startResendCooldown();
        } else {
          this.errorMsg = res.message || 'Failed to send OTP';
        }
        this.loading = false;
      },
      error: err => {
        this.errorMsg = err.error?.message || 'Invalid email or password';
        this.loading = false;
      }
    });
  }

  /** Step 2: verify OTP and complete login */
  onVerifyOtp(): void {
    this.otpSubmitted = true;
    if (this.otpForm.invalid) return;

    this.loading = true;
    this.errorMsg = '';

    const { otp } = this.otpForm.value;

    this.authService.verifyOtp({ email: this.otpEmail, otp }).subscribe({
      next: res => {
        if (res.status === 'success') {
          this.toast.success('Welcome back, ' + res.data.firstName + '!');
          if (res.data.role === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.errorMsg = res.message || 'OTP verification failed';
          this.loading = false;
        }
      },
      error: err => {
        this.errorMsg = err.error?.message || 'Invalid or expired OTP';
        this.loading = false;
      }
    });
  }

  /** Resend OTP using same credentials */
  onResendOtp(): void {
    if (this.resendCooldown > 0) return;

    this.loading = true;
    this.errorMsg = '';

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: res => {
        if (res.status === 'success') {
          this.toast.success('New OTP sent to your email!');
          this.startResendCooldown();
        } else {
          this.errorMsg = res.message || 'Failed to resend OTP';
        }
        this.loading = false;
      },
      error: err => {
        this.errorMsg = err.error?.message || 'Failed to resend OTP';
        this.loading = false;
      }
    });
  }

  /** Go back to credentials step */
  onBack(): void {
    this.step = 'credentials';
    this.otpForm.reset();
    this.otpSubmitted = false;
    this.errorMsg = '';
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
    }
  }

  private startResendCooldown(): void {
    this.resendCooldown = 30;
    if (this.resendTimer) clearInterval(this.resendTimer);
    this.resendTimer = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        clearInterval(this.resendTimer);
      }
    }, 1000);
  }
}
