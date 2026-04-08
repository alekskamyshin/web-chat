'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { AuthNotAuthenticatedError } from '@/features/auth/model/errors/auth.errors';
import { useMe } from '@/features/auth/model/hooks/useMe';
import { signOut } from '@/features/auth/services/auth.service';
import { disconnectSocket } from '@/features/socket/socket.service';
import { useChatSocket } from '@/features/socket/hooks/useChatSocket';
import { useChats } from '@/entities/chat/model/hooks/useChats';
import ChatSidebar from '@/app/chat/_components/ChatSidebar';
import ChatMain from '@/app/chat/_components/ChatMain';
import NewChatWidget from '@/features/new-chat/ui/NewChatWidget';
import Button from '@/shared/ui/components/Button/Button';
import { cn } from '@/shared/lib/cn';

export default function ChatPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: me, isLoading: isMeLoading, error: meError } = useMe();
  const { data: chatsData, isLoading: isChatsLoading } = useChats();
	const [isCreateChatModalOpen, setIsCreateChatModalOpen ] = useState<boolean>(false)

  const chats = chatsData?.items ?? [];

  const selectedChat = useMemo(() => {
    return chats.find((chat) => chat.id === selectedChatId) || null;
  }, [chats, selectedChatId]);

  useEffect(() => {
    if (meError instanceof AuthNotAuthenticatedError) {
      router.replace('/');
    }
  }, [meError, router]);

  useEffect(() => {
    if (!selectedChatId && chats.length > 0) {
      setSelectedChatId(chats[0].id);
    }
  }, [chats, selectedChatId]);

  useChatSocket({
    enabled: Boolean(me) && !meError,
    selectedChatId,
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await signOut();
      disconnectSocket();
      queryClient.clear();
      router.replace('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setIsSidebarOpen(false);
  };

  if (isMeLoading || (!me && !meError)) {
    return (
      <main className="flex flex-1 items-center justify-center bg-[color:var(--background)]">
        <p className="text-sm text-[color:var(--text-secondary)]">Loading...</p>
      </main>
    );
  }

  if (meError && !(meError instanceof AuthNotAuthenticatedError)) {
    return (
      <main className="flex flex-1 items-center justify-center bg-[color:var(--background)]">
        <p className="text-sm text-[color:var(--text-secondary)]">
          Something went wrong while loading your profile.
        </p>
      </main>
    );
  }

  return (
    <main className="flex h-full flex-1 bg-[color:var(--background)]">
      <div className="flex h-full w-full flex-1 flex-col lg:flex-row">
        <NewChatWidget
          isOpen={isCreateChatModalOpen}
          toggle={() => setIsCreateChatModalOpen((prev) => !prev)}
        />
        <div className="hidden w-full max-w-none lg:block lg:max-w-sm">
          <ChatSidebar
            chats={chats}
            selectedChatId={selectedChatId}
            onSelectChat={handleSelectChat}
            onCreateChat={() => setIsCreateChatModalOpen(true)}
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
            isLoading={isChatsLoading}
          />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="icon"
                size="icon"
                aria-label="Open chat list"
                onClick={() => setIsSidebarOpen(true)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                  <path
                    d="M4 6h16M4 12h16M4 18h10"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </Button>
              <Button
                type="button"
                variant="icon"
                size="icon"
                aria-label="Sign out"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-text-secondary/60 border-t-text-secondary" />
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                    <path
                      d="M8 6h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M11 9l-3 3 3 3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </Button>
            </div>
            <span className="text-sm font-semibold text-text-primary">Chats</span>
          </div>
          <div className={cn('flex overflow-hidden flex-1', isSidebarOpen ? 'hidden lg:flex' : 'flex')}>
            <ChatMain selectedChat={selectedChat} />
          </div>
        </div>
      </div>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden',
          isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setIsSidebarOpen(false)}
      >
        <div
          className={cn(
            'absolute left-0 top-0 h-full w-[85%] max-w-sm border-r border-border bg-surface transition-transform duration-200 ease-out',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <ChatSidebar
            chats={chats}
            selectedChatId={selectedChatId}
            onSelectChat={handleSelectChat}
            onCreateChat={() => setIsCreateChatModalOpen(true)}
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
            isLoading={isChatsLoading}
          />
        </div>
      </div>
    </main>
  );
}
