import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/providers/chat-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  type: string;
  metadata?: any;
  isRead: boolean;
  createdAt: string;
}

interface DirectMessageProps {
  receiverId: number;
  receiverName: string;
  receiverAvatar?: string;
}

export function DirectMessage({
  receiverId,
  receiverName,
  receiverAvatar,
}: DirectMessageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, sendMessage, markMessageAsRead } = useChat();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Load message history
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/messages/direct/${receiverId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load messages. Please try again.",
        });
      }
    };

    loadMessages();

    // Listen for new messages
    socket?.on('newDirectMessage', (message: Message) => {
      setMessages(prev => [...prev, message]);
      if (message.senderId === receiverId) {
        markMessageAsRead(message.id);
        toast({
          title: "New Message",
          description: `${receiverName} sent you a message`,
        });
      }
    });

    // Listen for read receipts
    socket?.on('messageRead', ({ messageId }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
      toast({
        title: "Message Read",
        description: `${receiverName} has read your message`,
      });
    });

    // Mark unread messages as read
    messages.forEach(message => {
      if (!message.isRead && message.senderId === receiverId) {
        markMessageAsRead(message.id);
      }
    });

    return () => {
      socket?.off('newDirectMessage');
      socket?.off('messageRead');
    };
  }, [receiverId, receiverName, socket, markMessageAsRead, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      sendMessage(newMessage.trim(), receiverId);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={receiverAvatar} />
            <AvatarFallback>{receiverName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{receiverName}</h2>
            <p className="text-sm text-gray-500">Direct Message</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex items-start gap-2 max-w-[70%] ${
                  message.senderId === user?.id ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      message.senderId === user?.id
                        ? undefined
                        : receiverAvatar
                    }
                  />
                  <AvatarFallback>
                    {message.senderId === user?.id ? 'You' : receiverName[0]}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg p-3 ${
                    message.senderId === user?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <p className="text-xs opacity-70">
                      {format(new Date(message.createdAt), 'HH:mm')}
                    </p>
                    {message.senderId === user?.id && (
                      <span className="text-xs opacity-70">
                        {message.isRead ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
} 