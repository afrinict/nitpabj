import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/providers/chat-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface ChatRoomProps {
  roomId: number;
  roomName: string;
}

export function ChatRoom({ roomId, roomName }: ChatRoomProps) {
  const [message, setMessage] = useState('');
  const { socket, messages, sendMessage, joinRoom, leaveRoom } = useChat();
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (socket) {
      joinRoom(roomId);

      // Listen for new messages
      socket.on('newMessage', (newMessage) => {
        if (newMessage.userId !== user?.id) {
          toast({
            title: "New Message",
            description: `${newMessage.userId} sent a message in ${roomName}`,
          });
        }
      });

      // Listen for typing indicators
      socket.on('userTyping', ({ userId, isTyping }) => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (isTyping) {
            newSet.add(userId);
          } else {
            newSet.delete(userId);
          }
          return newSet;
        });
      });
    }

    return () => {
      if (socket) {
        leaveRoom(roomId);
        socket.off('newMessage');
        socket.off('userTyping');
      }
    };
  }, [socket, roomId, joinRoom, leaveRoom, user?.id, roomName, toast]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socket) {
      sendMessage(message, roomId);
      setMessage('');
    }
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit('typing', { roomId, userId: user?.id, isTyping: true });
      // Stop typing indicator after 3 seconds
      setTimeout(() => {
        socket.emit('typing', { roomId, userId: user?.id, isTyping: false });
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{roomName}</h2>
        {typingUsers.size > 0 && (
          <p className="text-sm text-muted-foreground">
            {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
          </p>
        )}
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.userId === user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.userId === user?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!message.trim()}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
} 