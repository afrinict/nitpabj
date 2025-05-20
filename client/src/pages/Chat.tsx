import { useState } from 'react';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { DirectMessage } from '@/components/chat/DirectMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useChat } from '@/providers/chat-provider';
import { useAuth } from '@/hooks/use-auth';
import { Search, Plus } from 'lucide-react';
import { Card } from "@/components/ui/card";

interface ChatRoom {
  id: number;
  name: string;
  description: string;
  isPrivate: boolean;
}

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export default function Chat() {
  const [activeTab, setActiveTab] = useState("rooms");
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { onlineUsers } = useChat();
  const { user } = useAuth();

  // Mock data - replace with actual API calls
  const chatRooms: ChatRoom[] = [
    { id: 1, name: 'General', description: 'General discussion', isPrivate: false },
    { id: 2, name: 'Announcements', description: 'Important updates', isPrivate: false },
    { id: 3, name: 'Events', description: 'Event planning and discussion', isPrivate: false },
  ];

  const users: User[] = [
    { id: 1, username: 'john_doe', firstName: 'John', lastName: 'Doe' },
    { id: 2, username: 'jane_smith', firstName: 'Jane', lastName: 'Smith' },
    { id: 3, username: 'bob_wilson', firstName: 'Bob', lastName: 'Wilson' },
  ];

  const filteredRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 border-r">
        <div className="p-4 border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rooms">Chat Rooms</TabsTrigger>
              <TabsTrigger value="direct">Direct Messages</TabsTrigger>
            </TabsList>

            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-12rem)]">
              <TabsContent value="rooms" className="mt-0">
                <div className="p-2">
                  {filteredRooms.map((room) => (
                    <Button
                      key={room.id}
                      variant={selectedRoom?.id === room.id ? 'secondary' : 'ghost'}
                      className="w-full justify-start mb-1"
                      onClick={() => setSelectedRoom(room)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        {room.name}
                      </div>
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="direct" className="mt-0">
                <div className="p-2">
                  {filteredUsers.map((user) => (
                    <Button
                      key={user.id}
                      variant={selectedUser?.id === user.id ? 'secondary' : 'ghost'}
                      className="w-full justify-start mb-1"
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            onlineUsers.has(user.id) ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                        {user.firstName} {user.lastName}
                      </div>
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </ScrollArea>

            {activeTab === 'rooms' && (
              <div className="p-4 border-t">
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Room
                </Button>
              </div>
            )}
          </Tabs>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1">
        {activeTab === 'rooms' && selectedRoom ? (
          <ChatRoom roomId={selectedRoom.id} roomName={selectedRoom.name} />
        ) : activeTab === 'direct' && selectedUser ? (
          <DirectMessage
            receiverId={selectedUser.id}
            receiverName={`${selectedUser.firstName} ${selectedUser.lastName}`}
            receiverAvatar={selectedUser.avatar}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a chat room or user to start messaging
          </div>
        )}
      </div>
    </div>
  );
} 