import type { ChatListItemDto } from '@/api/generated/schemas';
import Button from '@/shared/ui/components/Button/Button';
import Chat from './Chat';

type ChatMainProps = {
  selectedChat?: ChatListItemDto | null;
};

export default function ChatMain({ selectedChat }: ChatMainProps) {
  if (!selectedChat) {
    return (
      <section className="flex h-full flex-1 items-center justify-center bg-background">
        <div className="max-w-md text-center">
          <p className="text-lg font-semibold text-text-primary">
            Select a chat to get started
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            Your messages will appear here once you choose a conversation.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full flex-1 flex-col bg-background">
      <div className="border-b border-border bg-surface px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {selectedChat.name || 'Direct chat'}
            </p>
            <p className="text-xs text-text-secondary">
              Active now
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
							variant='secondary'
							size='icon'
              aria-label="More options"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  d="M6 12h.01M12 12h.01M18 12h.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

			<Chat photoUrl={selectedChat.photoUrl} chatId={selectedChat.id} />

      <div className="min-h-20 border-t overflow-hidden border-border bg-surface px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-text-secondary">
            Message input (coming soon)
          </div>
          <Button
            type="button"
						variant='primary'
						size='icon'
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
              <path
                d="M4 12l16-7-4 7 4 7-16-7z"
                fill="currentColor"
              />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
}
