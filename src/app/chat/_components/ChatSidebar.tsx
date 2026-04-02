import type { ChatListItemDto } from '@/api/generated/schemas';

import Button from '@/shared/ui/components/Button/Button';
import ChatSidebarItem from './ChatSidebarItem';

type ChatSidebarProps = {
  chats: ChatListItemDto[];
  onSelectChat: (chatId: string) => void;
  onCreateChat: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
  isLoading: boolean;
};

export default function ChatSidebar({
  chats,
  onSelectChat,
  onCreateChat,
  onLogout,
  isLoggingOut,
  isLoading,
}: ChatSidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          aria-label="Sign out"
          variant="secondary"
					tooltip="Logout"
          size="icon"
        >
            {isLoggingOut ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-text-secondary/60 border-t-text-secondary" />
            ) : (
              <span className="font-bold">&lt;</span>
            )}
          </Button>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Direct chats
            </p>
            <p className="text-xs text-text-secondary">
              Your recent conversations
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={onCreateChat}
          aria-label="Create chat"
          variant="primary"
					title="New chat"
          size="icon"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4">
        {isLoading ? (
          <div className="space-y-3 px-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`chat-skeleton-${index}`}
                className="h-14 w-full animate-pulse rounded-2xl bg-elevated"
              />
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-text-secondary">
            No chats yet. Start a new conversation.
          </div>
        ) : (
          <ul className="space-y-2 px-2">
            {chats.map((chat) => <ChatSidebarItem key={chat.id} chat={chat} onSelectChat={onSelectChat} />)}
          </ul>
        )}
      </div>
    </aside>
  );
}
