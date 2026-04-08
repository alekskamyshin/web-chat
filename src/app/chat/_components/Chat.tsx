import { useLayoutEffect, useRef } from "react";

import { useMessages } from "@/entities/messages/model/hooks/useMessages";
import { useMe } from "@/features/auth/model/hooks/useMe";
import MessageBubble from "./MessageBubble";

type ChatProps = {
	chatId: string;
	photoUrl?:string | null;
}

export default function Chat({chatId, photoUrl}: ChatProps) {
  const { data: messageData, isLoading: isMessagesLoading } = useMessages(chatId);
  const { data: me, isLoading: isMeLoading  } = useMe();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const handledInitialScrollRef = useRef<string | null>(null);
  const lastMessageCountRef = useRef(0);
  const lastChatIdRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (isMessagesLoading) {
      return;
    }

    if (!messageData) {
      return;
    }

    if (!scrollContainerRef.current) {
      return;
    }

    if (handledInitialScrollRef.current === chatId) {
      return;
    }

    handledInitialScrollRef.current = chatId;
    lastChatIdRef.current = chatId;
    lastMessageCountRef.current = messageData.length;

    if (messageData.length === 0) {
      return;
    }

    requestAnimationFrame(() => {
      scrollContainerRef.current?.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'auto',
      });
    });
  }, [chatId, isMessagesLoading, messageData]);

  useLayoutEffect(() => {
    if (isMessagesLoading) {
      return;
    }

    if (!messageData) {
      return;
    }

    if (!scrollContainerRef.current) {
      return;
    }

    if (lastChatIdRef.current !== chatId) {
      lastChatIdRef.current = chatId;
      lastMessageCountRef.current = messageData.length;
      return;
    }

    const previousCount = lastMessageCountRef.current;
    const nextCount = messageData.length;
    lastMessageCountRef.current = nextCount;

    if (nextCount <= previousCount) {
      return;
    }

    const scrollContainer = scrollContainerRef.current;
    const distanceToBottom =
      scrollContainer.scrollHeight -
      scrollContainer.scrollTop -
      scrollContainer.clientHeight;

    const behavior = distanceToBottom > 50 ? 'smooth' : 'auto';
    scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior,
    });
  }, [chatId, isMessagesLoading, messageData]);

	if ( isMessagesLoading || isMeLoading ) {
		return (
			<span className="flex flex-1 flex-col w-full py-6 px-6 items-center justify-center">
				<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
			</span>
		)
	}


	if (!me) {
		return (
			<span className="flex h-8 w-8 items-center justify-center">
				Loading data...
			</span>
		)
	}

	if (!messageData) {
		return (
			<span className="flex h-8 w-8 items-center justify-center">
				No messages yet... start typing!
			</span>
		)
	}

	const isMyMessage = (id: string) => me.user.id === id

	return (
      <div ref={scrollContainerRef} className="flex flex-1 flex-col w-full py-6 px-6 overflow-auto">
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
