import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-(--color-primary) text-white hover:bg-(--color-primary-hover) shadow-[var(--shadow-sm)]",
  secondary:
    "bg-(--color-secondary) text-white hover:bg-(--color-secondary-hover)",
  outline:
    "bg-transparent text-(--color-foreground) border border-(--color-border-strong) hover:bg-(--color-surface-alt)",
  ghost:
    "bg-transparent text-(--color-foreground-muted) hover:bg-(--color-surface-alt) hover:text-(--color-foreground)",
  danger:
    "bg-(--color-danger) text-white hover:opacity-90",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "text-sm px-3.5 py-2 rounded-[var(--radius-sm)]",
  md: "text-sm px-5 py-3 rounded-[var(--radius-md)]",
  lg: "text-base px-7 py-4 rounded-[var(--radius-lg)]",
};

const BASE =
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-(--duration-base) ease-(--ease-out) active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
};

export default function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = "primary",
    size = "md",
    children,
    icon,
    className = "",
    ...rest
  } = props;

  const classes = `${BASE} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;

  if ("href" in props && props.href) {
    const { href, target, rel } = rest as ButtonAsLink;
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {icon}
      {children}
    </button>
  );
}
