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

// PR6: Dialog (Radix)
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  dialogContentVariants,
  type DialogContentProps,
} from "./components/dialog";
// PR7: Tooltip (Radix)
export {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "./components/tooltip";

// v1.9: Popover (Radix) — click-triggered floating panel
export {
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "./components/popover";

// v1.9: ScrollArea (Radix) — styled cross-browser scroll container
export { ScrollArea, ScrollBar } from "./components/scroll-area";

// PR8: Toast (Sonner wrapper)
export { Toaster, toast } from "./components/toast";
// PR9: Form controls (Switch + Checkbox + RadioGroup・Radix)
export { Switch } from "./components/switch";
export { Checkbox } from "./components/checkbox";
export { RadioGroup, RadioGroupItem } from "./components/radio-group";
// PR10: DropdownMenu (Radix)
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuTrigger,
} from "./components/dropdown-menu";

// PR11: Select (Radix)
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./components/select";
// PR12: Avatar (Radix)
export { Avatar, AvatarFallback, AvatarImage } from "./components/avatar";

// PR13: Tabs (Radix)
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/tabs";

// PR14: AlertDialog (Radix・Dialog の confirmation variant)
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./components/alert-dialog";
// PR15: Slider (Radix・range input)
export { Slider } from "./components/slider";

// PR16: Progress (Radix・determinate/indeterminate progress bar)
export { Progress } from "./components/progress";

// PR17: Separator (Radix・horizontal/vertical divider)
export { Separator } from "./components/separator";

// PR18: Skeleton (loading placeholder・CSS animate-pulse のみ)
export {
  Skeleton,
  skeletonVariants,
  type SkeletonProps,
} from "./components/skeleton";

// PR19: Sheet (Radix Dialog ベース・side drawer)
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
  sheetContentVariants,
  type SheetContentProps,
} from "./components/sheet";

// PR20: Toggle (Radix・single press/depress button・0.7.1)
export {
  Toggle,
  toggleVariants,
  type ToggleProps,
} from "./components/toggle";

// v1.4: FormField (compound a11y wiring・ADR-0015)
export {
  FormField,
  FormFieldControl,
  FormFieldDescription,
  FormFieldError,
  FormFieldLabel,
  type FormFieldControlProps,
  type FormFieldDescriptionProps,
  type FormFieldErrorProps,
  type FormFieldLabelProps,
  type FormFieldProps,
} from "./components/form-field";

// Issue #89: zero-dep CVA primitives batch
export { Alert, alertVariants, type AlertProps } from "./components/alert";
export {
  ButtonGroup,
  buttonGroupVariants,
  type ButtonGroupProps,
} from "./components/button-group";
export { Empty, emptyVariants, type EmptyProps } from "./components/empty";
export { Kbd, kbdVariants, type KbdProps } from "./components/kbd";
export { Spinner, spinnerVariants, type SpinnerProps } from "./components/spinner";
