'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { AuthNotAuthenticatedError } from '@/features/auth/model/errors/auth.errors';
import { useMe } from '@/features/auth/model/hooks/useMe';
import { signOut } from '@/features/auth/services/auth.service';
import { useChats } from '@/entities/chat/model/hooks/useChats';
import ChatSidebar from '@/app/chat/_components/ChatSidebar';
import ChatMain from '@/app/chat/_components/ChatMain';

export default function ChatPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { data: me, isLoading: isMeLoading, error: meError } = useMe();
  const { data: chatsData, isLoading: isChatsLoading } = useChats();
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

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await signOut();
      queryClient.clear();
      router.replace('/');
    } finally {
      setIsLoggingOut(false);
    }
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
    <main className="flex min-h-[calc(100vh-0px)] flex-1 bg-[color:var(--background)]">
      <div className="flex w-full flex-1 flex-col lg:flex-row">
        <div className="w-full max-w-none lg:max-w-sm">
          <ChatSidebar
            chats={chats}
            selectedChatId={selectedChatId}
            onSelectChat={setSelectedChatId}
            onCreateChat={() => console.log('create chat')}
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
            isLoading={isChatsLoading}
          />
        </div>
        <div className="flex flex-1">
          <ChatMain selectedChat={selectedChat} />
        </div>
      </div>
    </main>
  );
}
