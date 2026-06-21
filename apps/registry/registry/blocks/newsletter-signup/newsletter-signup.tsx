'use client';

import { useId, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  FormField,
  FormFieldControl,
  FormFieldError,
  FormFieldLabel,
  Input,
  Label,
  toast,
} from '@willink-labs/react';

/**
 * NewsletterSignup — a card-framed newsletter signup composing the
 * @willink-labs/react primitives (Card + FormField + Input + Checkbox + Label +
 * Button) with a success toast on submit. The email field is validated and a
 * consent checkbox is required before `onSubscribe` fires.
 *
 * Copy-to-own via `npx shadcn add @willink/newsletter-signup` — the markup,
 * copy, and validation are yours to edit, while the primitives and
 * `--color-brand` theming come from the npm packages (ADR-0020).
 *
 * IMPORTANT: this block fires `toast.success(...)` but does NOT render its own
 * `<Toaster />`. The Toaster is a singleton — mount it ONCE at your app root
 * (e.g. `layout.tsx`) for the toast to appear:
 *
 * @example
 *   import { Toaster } from '@willink-labs/react';
 *
 *   // app root (renders once)
 *   <Toaster />
 *
 *   // anywhere
 *   <NewsletterSignup onSubscribe={(email) => subscribe(email)} />
 */
export function NewsletterSignup({
  onSubscribe,
  heading = 'ニュースレターを購読',
  description = '最新のプロダクト情報とアップデートを月1回お届けします。',
  buttonLabel = '登録する',
  consentLabel = 'プライバシーポリシーに同意し、配信を希望します。',
}: {
  /** Called with the entered email once validation + consent pass. */
  onSubscribe?: (email: string) => void;
  /** Card title copy. */
  heading?: string;
  /** Card description copy. */
  description?: string;
  /** Submit button copy. */
  buttonLabel?: string;
  /** Consent checkbox label copy. */
  consentLabel?: string;
}) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>({});
  // Unique per instance so multiple <NewsletterSignup> on one page don't collide.
  const consentId = useId();
  const consentErrorId = `${consentId}-error`;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const next: { email?: string; consent?: string } = {};
    if (!email.includes('@')) {
      next.email = '有効なメールアドレスを入力してください。';
    }
    if (!consent) {
      next.consent = '配信に同意してください。';
    }
    setErrors(next);

    if (Object.keys(next).length > 0) return;

    onSubscribe?.(email);
    toast.success('登録しました', {
      description: `${email} に確認メールを送信しました。`,
    });
    setEmail('');
    setConsent(false);
  }

  return (
    <Card className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-xl">{heading}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <FormField invalid={Boolean(errors.email)}>
            <FormFieldLabel required>メールアドレス</FormFieldLabel>
            <FormFieldControl>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </FormFieldControl>
            {errors.email ? <FormFieldError>{errors.email}</FormFieldError> : null}
          </FormField>

          <div className="grid gap-2">
            <div className="flex items-start gap-2">
              <Checkbox
                id={consentId}
                checked={consent}
                onCheckedChange={(v) => setConsent(v === true)}
                aria-invalid={Boolean(errors.consent) || undefined}
                aria-describedby={errors.consent ? consentErrorId : undefined}
                className="mt-0.5"
              />
              <Label htmlFor={consentId} size="sm" className="font-normal">
                {consentLabel}
              </Label>
            </div>
            {errors.consent ? (
              <p id={consentErrorId} role="alert" className="text-sm text-danger">
                {errors.consent}
              </p>
            ) : null}
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full">
            {buttonLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
