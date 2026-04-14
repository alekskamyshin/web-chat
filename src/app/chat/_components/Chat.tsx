import { useEffect, useRef } from "react";

import { useMessages } from "@/entities/messages/model/hooks/useMessages";
import { useMe } from "@/features/auth/model/hooks/useMe";
import { useNotification } from "@/shared/lib/hooks/useNotification";
import MessageBubble from "./MessageBubble";
import { useChatAutoScroll } from "./useChatAutoScroll";

type ChatProps = {
	chatId: string;
	photoUrl?:string | null;
	scrollThreshold?: number;
}

export default function Chat({chatId, photoUrl, scrollThreshold = 50}: ChatProps) {
  const { data: messageData, isLoading: isMessagesLoading, error: messagesError } = useMessages(chatId);
  const { data: me, isLoading: isMeLoading  } = useMe();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const lastMessagesErrorRef = useRef<string | null>(null);
  const notify = useNotification();

  const { handleScroll } = useChatAutoScroll({
    chatId,
    messageCount: messageData?.length ?? 0,
    isMessagesLoading,
    containerRef: scrollContainerRef,
    threshold: scrollThreshold,
  });

  useEffect(() => {
    if (!messagesError) {
      lastMessagesErrorRef.current = null;
      return;
    }

    const message =
      messagesError instanceof Error
        ? messagesError.message
        : 'Unable to load messages.';

    if (lastMessagesErrorRef.current !== message) {
      lastMessagesErrorRef.current = message;
      notify.error('Messages failed to load', { description: message });
    }
  }, [messagesError, notify]);


	if ( isMessagesLoading || isMeLoading ) {
		return (
			<span className="flex flex-1 flex-col w-full py-6 px-6 items-center justify-center">
				<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
			</span>
		)
	}


	if (!me) {
		return (
			<span className="flex flex-1 flex-col w-full py-6 px-6 items-center justify-center">
				Loading data...
			</span>
		)
	}

	if (messagesError) {
		return (
			<span className="flex flex-1 flex-col w-full py-6 px-6 items-center justify-center">
				Unable to load messages.
			</span>
		)
	}

	if (!messageData) {
		return (
			<span className="flex flex-1 flex-col w-full py-6 px-6 items-center justify-center">
				No messages yet... start typing!
			</span>
		)
	}

	const isMyMessage = (id: string) => me.user.id === id

	return (
      <div ref={scrollContainerRef} onScroll={handleScroll} className="flex flex-1 flex-col w-full py-6 px-6 overflow-auto">
        <div className="flex flex-col gap-4">
				{ messageData.map( msg => {
					return (
						<MessageBubble key={msg.id} avatar={isMyMessage(msg.senderId) ?  me?.user.photoUrl : photoUrl} variant={isMyMessage(msg.senderId) ? 'send' : 'receive'} content={msg.content}/>
					)
				})}
        </div>
      </div>
	)

}
