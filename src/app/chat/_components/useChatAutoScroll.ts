'use client';

import { useLayoutEffect, useRef, type RefObject } from 'react';

type UseChatAutoScrollParams = {
  chatId: string;
  messageCount: number;
  isMessagesLoading: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  threshold?: number;
};

export const useChatAutoScroll = ({
  chatId,
  messageCount,
  isMessagesLoading,
  containerRef,
  threshold = 50,
}: UseChatAutoScrollParams) => {
  const handledInitialScrollRef = useRef<string | null>(null);
  const lastMessageCountRef = useRef(0);
  const lastChatIdRef = useRef<string | null>(null);
  const distanceToBottomRef = useRef(0);

  useLayoutEffect(() => {
    if (isMessagesLoading) {
      return;
    }

    if (!containerRef.current) {
      return;
    }

    if (handledInitialScrollRef.current === chatId) {
      return;
    }

    handledInitialScrollRef.current = chatId;
    lastChatIdRef.current = chatId;
    lastMessageCountRef.current = messageCount;

    distanceToBottomRef.current =
      containerRef.current.scrollHeight -
      containerRef.current.scrollTop -
      containerRef.current.clientHeight;

    if (messageCount === 0) {
      return;
    }

    requestAnimationFrame(() => {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'auto',
      });
    });
  }, [chatId, isMessagesLoading, messageCount, containerRef]);

  useLayoutEffect(() => {
    if (isMessagesLoading) {
      return;
    }

    if (!containerRef.current) {
      return;
    }

    if (lastChatIdRef.current !== chatId) {
      lastChatIdRef.current = chatId;
      lastMessageCountRef.current = messageCount;
      return;
    }

    const previousCount = lastMessageCountRef.current;
    const nextCount = messageCount;
    lastMessageCountRef.current = nextCount;

    if (nextCount <= previousCount) {
      return;
    }

    if (distanceToBottomRef.current > threshold) {
      return;
    }

    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [chatId, isMessagesLoading, messageCount, threshold, containerRef]);

  const handleScroll = () => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    distanceToBottomRef.current =
      container.scrollHeight - container.scrollTop - container.clientHeight;
  };

  return { handleScroll };
};
