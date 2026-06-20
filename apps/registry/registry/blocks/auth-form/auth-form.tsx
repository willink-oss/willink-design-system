'use client';

import { useState, type FormEvent } from 'react';
import {
  Button,
  Checkbox,
  FormField,
  FormFieldControl,
  FormFieldError,
  FormFieldLabel,
  Input,
  Label,
  Separator,
} from '@willink-labs/react';

/**
 * AuthForm — a token-themed sign-in form composing the @willink-labs/react
 * primitives (FormField + Input + Checkbox + Button + Separator). This is a
 * copy-to-own block: the markup and validation are yours to edit, while the
 * primitives and `--color-brand` theming come from the npm packages (ADR-0020).
 */
export function AuthForm({
  onSubmit,
}: {
  onSubmit?: (data: { email: string; password: string; remember: boolean }) => void;
}) {
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') ?? '');
    const password = String(fd.get('password') ?? '');
    const remember = fd.get('remember') === 'on';

    const next: { email?: string; password?: string } = {};
    if (!email.includes('@')) next.email = '有効なメールアドレスを入力してください。';
    if (password.length < 8) next.password = 'パスワードは 8 文字以上で入力してください。';
    setErrors(next);

    if (Object.keys(next).length === 0) onSubmit?.({ email, password, remember });
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <FormField invalid={Boolean(errors.email)}>
        <FormFieldLabel required>メールアドレス</FormFieldLabel>
        <FormFieldControl>
          <Input name="email" type="email" placeholder="you@example.com" autoComplete="email" />
        </FormFieldControl>
        {errors.email ? <FormFieldError>{errors.email}</FormFieldError> : null}
      </FormField>

      <FormField invalid={Boolean(errors.password)}>
        <FormFieldLabel required>パスワード</FormFieldLabel>
        <FormFieldControl>
          <Input name="password" type="password" autoComplete="current-password" />
        </FormFieldControl>
        {errors.password ? <FormFieldError>{errors.password}</FormFieldError> : null}
      </FormField>

      <div className="flex items-center gap-2">
        <Checkbox id="remember" name="remember" />
        <Label htmlFor="remember">ログイン状態を保持する</Label>
      </div>

      <Button type="submit">ログイン</Button>

      <div className="flex items-center gap-3 text-sm text-muted">
        <Separator className="flex-1" />
        <span>または</span>
        <Separator className="flex-1" />
      </div>

      <Button variant="outline" type="button">
        新規登録
      </Button>
    </form>
  );
}
