// src/types/onboarding.types.ts

export interface OnboardingStatus {
  current_step:         string | number;
  onboarding_completed: boolean;
  roles:                string[];
  full_legal_name?:     string;
  nationality?:         string;
  visa_targets:         string[];
}

export interface OnboardingProfileRequest {
  full_legal_name: string;
  nationality:     string;
  visa_targets:    string[];
}

export interface OnboardingRoleRequest {
  role: string;
}

export interface VerifyEmailRequest {
  otp: string;
}