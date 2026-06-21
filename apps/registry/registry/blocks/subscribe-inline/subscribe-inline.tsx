'use client';

import { useState } from 'react';
import {
  Alert,
  Button,
  FormField,
  FormFieldControl,
  FormFieldError,
  FormFieldLabel,
  Input,
} from '@willink-labs/react';

/**
 * SubscribeInline — a compact inline email-capture (newsletter / waitlist)
 * composing the @willink-labs/react primitives (FormField + Input + Button +
 * Alert). This is a copy-to-own block: the markup is yours to edit, while the
 * primitives and theming come from the npm packages — a consumer's single
 * `--color-brand` override re-themes it (ADR-0020).
 *
 * On submit the email is validated (must contain '@'); an invalid value shows a
 * FormFieldError (and flips the Input to its invalid state), while a valid value
 * renders a success Alert and invokes `onSubscribe(email)`.
 */
export function SubscribeInline({
  onSubscribe,
  placeholder = 'you@example.com',
  buttonLabel = '登録する',
  successMessage = 'ご登録ありがとうございます。確認メールをお送りしました。',
}: {
  onSubscribe?: (email: string) => void;
  placeholder?: string;
  buttonLabel?: string;
  successMessage?: string;
}) {
  const [error, setError] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') ?? '').trim();

    if (!email.includes('@')) {
      setError('有効なメールアドレスを入力してください。');
      setSubmitted(false);
      return;
    }

    setError(undefined);
    setSubmitted(true);
    onSubscribe?.(email);
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="flex items-start gap-2">
        <FormField invalid={Boolean(error)} className="flex-1">
          <FormFieldLabel className="sr-only">メールアドレス</FormFieldLabel>
          <FormFieldControl>
            <Input
              name="email"
              type="email"
              placeholder={placeholder}
              autoComplete="email"
            />
          </FormFieldControl>
          {error ? <FormFieldError>{error}</FormFieldError> : null}
        </FormField>

        <Button type="submit">{buttonLabel}</Button>
      </form>

      {submitted ? (
        <Alert variant="success" role="status">
          {successMessage}
        </Alert>
      ) : null}
    </div>
  );
}
