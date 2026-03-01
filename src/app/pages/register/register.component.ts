import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['']
    });
  }

  get f() { return this.registerForm.controls; }

  onRegister(): void {
    this.submitted = true;
    if (this.registerForm.invalid) return;
    
    this.loading = true;
    this.errorMsg = '';
    
    const formValue = this.registerForm.value;
    
    this.authService.register({
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      password: formValue.password,
      phone: formValue.phone || undefined
    }).subscribe({
      next: () => {
        this.toast.success('Account created! Please sign in.');
        this.router.navigate(['/login']);
      },
      error: err => {
        this.errorMsg = err.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}
