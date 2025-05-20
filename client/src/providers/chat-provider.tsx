import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/use-auth';

interface Message {
  id: number;
  content: string;
  userId: number;
  roomId: number;
  createdAt: string;
}

interface DirectMessage {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  type: string;
  metadata?: any;
  isRead: boolean;
  createdAt: string;
}

interface ChatContextType {
  socket: Socket | null;
  messages: Message[];
  onlineUsers: Set<number>;
  sendMessage: (content: string, roomId: number) => void;
  joinRoom: (roomId: number) => void;
  leaveRoom: (roomId: number) => void;
  markMessageAsRead: (messageId: number) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Initialize socket connection
    const newSocket = io('http://localhost:3000', {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    newSocket.on('online_users', (users: number[]) => {
      setOnlineUsers(new Set(users));
    });

    newSocket.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('message_history', (history: Message[]) => {
      setMessages(history);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  const sendMessage = (content: string, roomId: number) => {
    if (!socket || !user) return;

    socket.emit('message', {
      content,
      roomId,
    });
  };

  const joinRoom = (roomId: number) => {
    if (!socket) return;
    socket.emit('join_room', roomId);
  };

  const leaveRoom = (roomId: number) => {
    if (!socket) return;
    socket.emit('leave_room', roomId);
  };

  const markMessageAsRead = (messageId: number) => {
    if (!socket || !user) return;
    socket.emit('messageRead', { messageId, userId: user.id });
  };

  return (
    <ChatContext.Provider
      value={{
        socket,
        messages,
        onlineUsers,
        sendMessage,
        joinRoom,
        leaveRoom,
        markMessageAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 