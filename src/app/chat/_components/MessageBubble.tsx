import { cn } from "@/shared/lib/cn";

const messageTypes = {
	send: 'send',
	receive:'receive'
} as const;

type MessageType = keyof typeof messageTypes

type Props = {
	variant: MessageType;
	content: string;
	avatar?: string | null;

}

export default function MessageBubble({
	variant,
	content,
	avatar
}: Props) {

	const variants = {
		[messageTypes.send]: "justify-start",
		[messageTypes.receive]: "justify-end",
	}

	const baseClasses =
		"flex gap-3";

	return (
		<div 
			className={cn(baseClasses, variants[variant])}
		>
			<div className="h-9 w-9 rounded-full overflow-hidden bg-[color:var(--elevated)]">
				{ avatar && <img className="h-full w-full object-cover" src={avatar} /> }
			</div>
			<div className="rounded-2xl bg-[color:var(--elevated)] px-4 py-3 text-sm text-[color:var(--text-primary)]">
				{ content }
			</div>
		</div>
	)

}
