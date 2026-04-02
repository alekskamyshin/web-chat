import { ChatListItemDto } from "@/api/generated/schemas";
import { Avatar } from "@/shared/ui/components/Avatar/Avatar";
import Button from "@/shared/ui/components/Button/Button";
import { formatTime } from "@/shared/utils";

type Props = {
  chat: ChatListItemDto;
  onSelectChat: (chatId: string) => void;
}

export default function ChatSidebarItem({
	chat,
	onSelectChat
}: Props) {

	const lastMessage = chat.lastMessage?.content ?? 'No messages yet.';
	const lastTime = formatTime(chat.lastMessage?.createdAt);

	return (
		<li>
			<Button
				fullWidth
				onClick={() => onSelectChat(chat.id)}
			>
				<Avatar src={chat.photoUrl} name={chat.name ?? ''} alt={chat.name ?? ''} />
				<div className="flex-1">
					<div className="flex items-center justify-between gap-2">
						<p className="text-sm font-semibold text-text-primary">
							{chat.name || 'Direct chat'}
						</p>
						{lastTime ? (
							<span className="text-xs text-text-secondary">
								{lastTime}
							</span>
						) : null}
					</div>
					<p className="truncate text-xs text-text-secondary">
						{lastMessage}
					</p>
				</div>
				{chat.unreadCount > 0 ? (
					<span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-accent px-2 text-xs font-semibold text-white">
						{chat.unreadCount}
					</span>
				) : null}
			</Button>
		</li>
	);
}
