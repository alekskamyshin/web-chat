import { io, Socket } from 'socket.io-client';

import type { MessageDto } from '@/api/generated/schemas';

type ServerToClientEvents = {
  'chat:message': (message: MessageDto) => void;
  'chat:error': (payload: { message?: string }) => void;
};

type ClientToServerEvents = {
  'chat:send': (
    payload: { chatId: string; content: string },
    ack: (response: { ok: boolean; data?: MessageDto; error?: string }) => void,
  ) => void;
};

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

const getSocketUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (baseUrl) {
    return baseUrl;
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  throw new Error('Socket URL is not available.');
};

export const connectSocket = () => {
  if (socket) {
    return socket;
  }

  const url = getSocketUrl();

  socket = io(url, {
    path: '/socket.io',
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
