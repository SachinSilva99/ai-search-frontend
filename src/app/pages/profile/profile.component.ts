import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { UserProfile } from '../../models/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  loading: boolean = true;
  saving: boolean = false;
  changingPwd: boolean = false;

  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService, 
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{value: '', disabled: true}],
      phone: [''],
      address: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.userService.getProfile().subscribe({
      next: p => { 
        this.profile = p; 
        this.profileForm.patchValue({
          firstName: p.firstName,
          lastName: p.lastName,
          email: p.email,
          phone: p.phone,
          address: p.address
        });
        this.loading = false; 
      },
      error: () => this.loading = false
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.toast.warning('Please check the input fields');
      return;
    }
    this.saving = true;
    const formVal = this.profileForm.getRawValue();
    this.userService.updateProfile({
      firstName: formVal.firstName,
      lastName: formVal.lastName,
      phone: formVal.phone,
      address: formVal.address
    }).subscribe({
      next: () => { this.toast.success('Profile updated!'); this.saving = false; },
      error: () => { this.toast.error('Failed to update profile'); this.saving = false; }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.toast.warning('Please fill in both password fields correctly');
      return;
    }
    
    this.changingPwd = true;
    const val = this.passwordForm.value;
    
    this.userService.changePassword(val.currentPassword, val.newPassword).subscribe({
      next: () => {
        this.toast.success('Password changed!');
        this.passwordForm.reset();
        this.changingPwd = false;
      },
      error: () => { this.toast.error('Failed to change password'); this.changingPwd = false; }
    });
  }
}
