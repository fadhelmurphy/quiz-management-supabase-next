'use client';

import { AuthForm } from '@/components/auth/auth-form';
import { LanguageToggle } from '@/components/ui/language-toggle';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LanguageToggle />
      <AuthForm type="register" />
    </div>
  );
}