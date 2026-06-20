'use client';

import { useState } from 'react';
import {
  Button,
  FormField,
  FormFieldControl,
  FormFieldError,
  FormFieldLabel,
  Input,
  Textarea,
} from '@willink-labs/react';

/**
 * ContactForm — a token-themed contact form composing the @willink-labs/react
 * primitives (FormField + Input + Textarea + Button). This is a copy-to-own block:
 * the markup is yours to edit, while the primitives and theming come from the npm
 * packages — a consumer's single `--color-brand` override re-themes it (ADR-0020).
 */
export function ContactForm({
  onSubmit,
}: {
  onSubmit?: (data: { name: string; email: string; message: string }) => void;
}) {
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') ?? '');
    const email = String(fd.get('email') ?? '');
    const message = String(fd.get('message') ?? '');

    const next: { email?: string; message?: string } = {};
    if (!email.includes('@')) next.email = '有効なメールアドレスを入力してください。';
    if (!message.trim()) next.message = 'メッセージを入力してください。';
    setErrors(next);

    if (Object.keys(next).length === 0) onSubmit?.({ name, email, message });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField>
        <FormFieldLabel>お名前</FormFieldLabel>
        <FormFieldControl>
          <Input name="name" placeholder="山田 太郎" autoComplete="name" />
        </FormFieldControl>
      </FormField>

      <FormField invalid={Boolean(errors.email)}>
        <FormFieldLabel required>メールアドレス</FormFieldLabel>
        <FormFieldControl>
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </FormFieldControl>
        {errors.email ? <FormFieldError>{errors.email}</FormFieldError> : null}
      </FormField>

      <FormField invalid={Boolean(errors.message)}>
        <FormFieldLabel required>メッセージ</FormFieldLabel>
        <FormFieldControl>
          <Textarea
            name="message"
            rows={5}
            placeholder="お問い合わせ内容をご記入ください。"
          />
        </FormFieldControl>
        {errors.message ? <FormFieldError>{errors.message}</FormFieldError> : null}
      </FormField>

      <Button type="submit">送信する</Button>
    </form>
  );
}
