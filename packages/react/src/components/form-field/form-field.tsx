import { Slot } from "@radix-ui/react-slot";
import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useId,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "../../lib/cn";
import { Label, type LabelProps } from "../label";

/**
 * FormField — Label + control + description + error message の a11y 配線を
 * 自動化する compound (ADR-0015)。手書きの id / htmlFor / aria-describedby /
 * aria-invalid 配線を不要にする。
 *
 * id は `useId()` で生成し context 経由で配布。`FormFieldDescription` /
 * `FormFieldError` の有無は **直接の子要素** を検査して判定するため
 * (SSR-safe・effect 不使用)、両者は `FormField` の直下に置くこと。
 *
 * @example
 *   <FormField>
 *     <FormFieldLabel required>メールアドレス</FormFieldLabel>
 *     <FormFieldControl>
 *       <Input type="email" />
 *     </FormFieldControl>
 *     <FormFieldDescription>会社のメールアドレスを入力してください。</FormFieldDescription>
 *     <FormFieldError>{errors.email}</FormFieldError>
 *   </FormField>
 */

type FormFieldContextValue = {
  /** Control の id (FormFieldLabel の htmlFor が参照する)。 */
  controlId: string;
  descriptionId: string;
  errorId: string;
  /** Control に aria-invalid を立てるか。 */
  invalid: boolean;
  /** 実際に描画される description / error の id 群 (space 区切り)。 */
  describedBy: string | undefined;
};

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

function useFormFieldContext(consumer: string): FormFieldContextValue {
  const ctx = useContext(FormFieldContext);
  if (!ctx) {
    throw new Error(`<${consumer}> must be used within <FormField>`);
  }
  return ctx;
}

/** Children.toArray は null / undefined / boolean を落とすので、残りが空文字以外なら内容ありとみなす。 */
function hasRenderableContent(node: ReactNode): boolean {
  return Children.toArray(node).some((child) => child !== "");
}

export type FormFieldProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Error 状態の明示的な上書き。省略時は直下の `<FormFieldError>` が内容を
   * 持つかどうかから導出される (メッセージなしで invalid にしたい場合のみ指定)。
   */
  invalid?: boolean;
};

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, invalid, children, ...props }, ref) => {
    const baseId = useId();
    const controlId = baseId;
    const descriptionId = `${baseId}-description`;
    const errorId = `${baseId}-error`;

    const childArray = Children.toArray(children);
    const hasDescription = childArray.some(
      (child) => isValidElement(child) && child.type === FormFieldDescription,
    );
    const hasError = childArray.some(
      (child) =>
        isValidElement(child) &&
        child.type === FormFieldError &&
        hasRenderableContent((child.props as { children?: ReactNode }).children),
    );

    const isInvalid = invalid ?? hasError;
    const describedBy =
      [hasDescription ? descriptionId : null, hasError ? errorId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <FormFieldContext.Provider
        value={{ controlId, descriptionId, errorId, invalid: isInvalid, describedBy }}
      >
        <div ref={ref} className={cn("grid gap-2", className)} {...props}>
          {children}
        </div>
      </FormFieldContext.Provider>
    );
  },
);
FormField.displayName = "FormField";

export type FormFieldLabelProps = LabelProps;

/** Label に context の control id を htmlFor として注入する (明示 prop が優先)。 */
export const FormFieldLabel = forwardRef<ElementRef<typeof Label>, FormFieldLabelProps>(
  (props, ref) => {
    const { controlId } = useFormFieldContext("FormFieldLabel");
    return <Label ref={ref} htmlFor={controlId} {...props} />;
  },
);
FormFieldLabel.displayName = "FormFieldLabel";

export type FormFieldControlProps = ComponentPropsWithoutRef<typeof Slot>;

/**
 * Slot — 任意の control (Input / Textarea / native element / Radix trigger) を
 * 1 つだけ子に取り、id / aria-describedby / aria-invalid を注入する。
 * 自前の aria-describedby を渡した場合は生成分とマージされる。
 */
export const FormFieldControl = forwardRef<HTMLElement, FormFieldControlProps>(
  ({ "aria-describedby": ariaDescribedBy, ...props }, ref) => {
    const { controlId, invalid, describedBy } = useFormFieldContext("FormFieldControl");
    const mergedDescribedBy =
      [ariaDescribedBy, describedBy].filter(Boolean).join(" ") || undefined;
    return (
      <Slot
        ref={ref}
        id={controlId}
        aria-describedby={mergedDescribedBy}
        aria-invalid={invalid || undefined}
        {...props}
      />
    );
  },
);
FormFieldControl.displayName = "FormFieldControl";

export type FormFieldDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const FormFieldDescription = forwardRef<
  HTMLParagraphElement,
  FormFieldDescriptionProps
>(({ className, ...props }, ref) => {
  const { descriptionId } = useFormFieldContext("FormFieldDescription");
  return (
    <p
      ref={ref}
      id={descriptionId}
      className={cn("text-sm text-muted", className)}
      {...props}
    />
  );
});
FormFieldDescription.displayName = "FormFieldDescription";

export type FormFieldErrorProps = HTMLAttributes<HTMLParagraphElement>;

/**
 * Error message — 内容があるときだけ描画される (`<FormFieldError>{errors.x}</FormFieldError>`
 * と常時マウントしてよい)。動的に現れたエラーを SR が読み上げるよう `role="alert"`。
 */
export const FormFieldError = forwardRef<HTMLParagraphElement, FormFieldErrorProps>(
  ({ className, children, ...props }, ref) => {
    const { errorId } = useFormFieldContext("FormFieldError");
    if (!hasRenderableContent(children)) return null;
    return (
      <p
        ref={ref}
        id={errorId}
        role="alert"
        className={cn("text-sm text-danger", className)}
        {...props}
      >
        {children}
      </p>
    );
  },
);
FormFieldError.displayName = "FormFieldError";
