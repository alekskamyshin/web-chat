import { cn } from "@/shared/lib/cn";

type AvatarProps = {
  src?: string | null;
  name?: string;   // used for initials + fallback label
  alt?: string;    // used only when img is shown
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function Avatar({
	src,
	name,
	alt,
	className
}: AvatarProps) {

	const baseClasses = "flex h-10 w-10 items-center justify-center rounded-2xl bg-elevated text-xs font-semibold text-secondary"

	return (
				<div 
						className={cn(baseClasses, className)}
					>
					{ src ? 
						<img
							className="rounded-2xl object-cover"
							src={src}
							alt={alt ?? name ?? 'Avatar'}
							loading="lazy"
							decoding="async"
						/> :
						<span className="rounded-2xl">{name?.split(' ').map(s => s[0].toUpperCase()).join('. ')}</span> 
					}
				</div>
	)

}
