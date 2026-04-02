import { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

const sizes = {
  default: 'px-4 py-2',
  icon: 'h-10 w-10 rounded-full',
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
	fullWidth?: boolean;
  size?: keyof typeof sizes
  tooltip?: string;
  children: ReactNode;
};


export default function Button({
	children,
	className,
	variant = 'secondary',
	size = 'default',
	tooltip,
	fullWidth,
	...props
}: ButtonProps) {
	const baseClasses =
		"inline-flex items-center justify-center gap-2 rounded-2xl border text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer";

	const variants = {
		primary:
		"border-accent bg-accent text-white hover:border-primary hover:bg-primary",
		secondary:
		"border-border bg-elevated text-text-secondary hover:border-accent hover:text-accent",
	} as const;

	return (
		<button
			className={cn(baseClasses, fullWidth && 'w-full', variants[variant], sizes[size], className)}
			title={tooltip}
			{...props}
		>
			{children}
		</button>
	)
}
