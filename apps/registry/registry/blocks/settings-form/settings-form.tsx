'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@willink-labs/react';

/**
 * SettingsForm — a token-themed account/preferences surface composing the
 * @willink-labs/react primitives (Tabs + Card + Switch + Select + RadioGroup +
 * Separator + Button). Tabs split the settings into プロフィール / 通知 / 表示
 * sections; each TabsContent holds a Card of grouped setting rows (a labelled
 * description paired with a Switch, Select, or RadioGroup) above a save footer.
 *
 * Copy-to-own via `npx shadcn add @willink/settings-form` — the sections,
 * controls, and persistence are yours to edit, while the primitives and
 * `--color-brand` theming come from the npm packages (ADR-0020).
 */

export type SettingsValues = {
  /** Display name shown across the product. */
  displayName: string;
  /** UI language. */
  language: string;
  /** IANA-ish timezone key. */
  timezone: string;
  /** Email notification toggle. */
  emailNotifications: boolean;
  /** Push notification toggle. */
  pushNotifications: boolean;
  /** Weekly digest email toggle. */
  weeklyDigest: boolean;
  /** Color theme preference. */
  theme: 'light' | 'dark' | 'system';
  /** Compact density toggle. */
  compactMode: boolean;
};

const DEFAULT_VALUES: SettingsValues = {
  displayName: '山田 太郎',
  language: 'ja',
  timezone: 'Asia/Tokyo',
  emailNotifications: true,
  pushNotifications: false,
  weeklyDigest: true,
  theme: 'system',
  compactMode: false,
};

/** A label + description stacked to the left of a control, sized for a settings row. */
function SettingRow({
  htmlFor,
  title,
  description,
  control,
}: {
  /** Associates the row's <Label> with the control's id (Switch / Select trigger). */
  htmlFor?: string;
  title: string;
  description: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <div className="grid gap-1">
        <Label htmlFor={htmlFor} className="text-sm">
          {title}
        </Label>
        <p className="text-sm text-muted">{description}</p>
      </div>
      <div className="shrink-0 pt-0.5">{control}</div>
    </div>
  );
}

export function SettingsForm({
  defaultValues,
  onSave,
  onCancel,
}: {
  /** Initial settings; merged over sensible JP defaults. */
  defaultValues?: Partial<SettingsValues>;
  /** Called with the current values when 保存 is pressed. */
  onSave?: (values: SettingsValues) => void;
  /** Called when キャンセル is pressed (e.g. to reset or close). */
  onCancel?: () => void;
}) {
  const [values, setValues] = useState<SettingsValues>({
    ...DEFAULT_VALUES,
    ...defaultValues,
  });

  function set<K extends keyof SettingsValues>(key: K, value: SettingsValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  const footer = (
    <CardFooter className="justify-end gap-3 border-t border-border pt-6">
      <Button variant="ghost" type="button" onClick={() => onCancel?.()}>
        キャンセル
      </Button>
      <Button type="button" onClick={() => onSave?.(values)}>
        保存
      </Button>
    </CardFooter>
  );

  return (
    <Tabs defaultValue="profile" className="w-full max-w-2xl">
      <TabsList>
        <TabsTrigger value="profile">プロフィール</TabsTrigger>
        <TabsTrigger value="notifications">通知</TabsTrigger>
        <TabsTrigger value="appearance">表示</TabsTrigger>
      </TabsList>

      {/* プロフィール — display name + locale selects */}
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">プロフィール</CardTitle>
            <CardDescription>
              アカウントの基本情報と地域設定を管理します。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="settings-display-name" className="text-sm">
                表示名
              </Label>
              <Input
                id="settings-display-name"
                value={values.displayName}
                onChange={(e) => set('displayName', e.target.value)}
                autoComplete="name"
                className="max-w-xs"
              />
              <p className="text-sm text-muted">
                ほかのメンバーに表示される名前です。
              </p>
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label htmlFor="settings-language" className="text-sm">
                言語
              </Label>
              <Select
                value={values.language}
                onValueChange={(v) => set('language', v)}
              >
                <SelectTrigger id="settings-language" className="max-w-xs">
                  <SelectValue placeholder="言語を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted">
                管理画面と通知メールに使用される言語です。
              </p>
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label htmlFor="settings-timezone" className="text-sm">
                タイムゾーン
              </Label>
              <Select
                value={values.timezone}
                onValueChange={(v) => set('timezone', v)}
              >
                <SelectTrigger id="settings-timezone" className="max-w-xs">
                  <SelectValue placeholder="タイムゾーンを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Tokyo">東京 (GMT+9)</SelectItem>
                  <SelectItem value="Asia/Singapore">シンガポール (GMT+8)</SelectItem>
                  <SelectItem value="Europe/London">ロンドン (GMT+0)</SelectItem>
                  <SelectItem value="America/Los_Angeles">
                    ロサンゼルス (GMT-8)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted">
                日時の表示に使用されるタイムゾーンです。
              </p>
            </div>
          </CardContent>
          {footer}
        </Card>
      </TabsContent>

      {/* 通知 — boolean switches */}
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">通知</CardTitle>
            <CardDescription>
              受け取る通知の種類を選択します。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <SettingRow
              htmlFor="settings-email-notifications"
              title="メール通知"
              description="重要な更新をメールで受け取ります。"
              control={
                <Switch
                  id="settings-email-notifications"
                  checked={values.emailNotifications}
                  onCheckedChange={(v) => set('emailNotifications', v)}
                />
              }
            />
            <Separator />
            <SettingRow
              htmlFor="settings-push-notifications"
              title="プッシュ通知"
              description="ブラウザやモバイルにプッシュ通知を送信します。"
              control={
                <Switch
                  id="settings-push-notifications"
                  checked={values.pushNotifications}
                  onCheckedChange={(v) => set('pushNotifications', v)}
                />
              }
            />
            <Separator />
            <SettingRow
              htmlFor="settings-weekly-digest"
              title="週次ダイジェスト"
              description="毎週月曜にアクティビティのまとめを送信します。"
              control={
                <Switch
                  id="settings-weekly-digest"
                  checked={values.weeklyDigest}
                  onCheckedChange={(v) => set('weeklyDigest', v)}
                />
              }
            />
          </CardContent>
          {footer}
        </Card>
      </TabsContent>

      {/* 表示 — theme radio + density switch */}
      <TabsContent value="appearance">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">表示</CardTitle>
            <CardDescription>
              テーマと表示密度をカスタマイズします。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3">
              <div className="grid gap-1">
                <span id="settings-theme-label" className="text-sm font-medium text-fg">
                  テーマ
                </span>
                <p className="text-sm text-muted">
                  画面の配色を選択します。
                </p>
              </div>
              <RadioGroup
                aria-labelledby="settings-theme-label"
                value={values.theme}
                onValueChange={(v) => set('theme', v as SettingsValues['theme'])}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="light" id="settings-theme-light" />
                  <Label htmlFor="settings-theme-light" className="text-sm font-normal">
                    ライト
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="dark" id="settings-theme-dark" />
                  <Label htmlFor="settings-theme-dark" className="text-sm font-normal">
                    ダーク
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="system" id="settings-theme-system" />
                  <Label htmlFor="settings-theme-system" className="text-sm font-normal">
                    システム設定に合わせる
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <SettingRow
              htmlFor="settings-compact-mode"
              title="コンパクト表示"
              description="余白を詰めて一度に多くの情報を表示します。"
              control={
                <Switch
                  id="settings-compact-mode"
                  checked={values.compactMode}
                  onCheckedChange={(v) => set('compactMode', v)}
                />
              }
            />
          </CardContent>
          {footer}
        </Card>
      </TabsContent>
    </Tabs>
  );
}
