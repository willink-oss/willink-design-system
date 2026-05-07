// @willink-labs/react — i-Willink Design System React components.

export { cn } from "./lib/cn";

// PR2: Button + Badge
export { Button, buttonVariants, type ButtonProps } from "./components/button";
export { Badge, badgeVariants, type BadgeProps } from "./components/badge";

// PR3: Input + Textarea + Label
export { Input, type InputProps } from "./components/input";
export { Textarea, type TextareaProps } from "./components/textarea";
export { Label, labelVariants, type LabelProps } from "./components/label";

// PR4: Card (compound)
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cardVariants,
  type CardProps,
} from "./components/card";

// PR5: Accordion (Radix)
export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/accordion";
