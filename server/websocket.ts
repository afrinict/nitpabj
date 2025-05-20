import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { db } from './db';
import { messages, directMessages, notifications } from '../shared/schema';
import { eq, and } from 'drizzle-orm';

interface ChatMessage {
  roomId?: number;
  senderId: number;
  receiverId?: number;
  content: string;
  type: string;
  metadata?: any;
}

export function setupWebSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3050',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Store online users
  const onlineUsers = new Map<number, string>();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user authentication
    socket.on('authenticate', async (userId: number) => {
      onlineUsers.set(userId, socket.id);
      socket.join(`user:${userId}`);
      io.emit('userStatus', { userId, status: 'online' });
    });

    // Handle joining chat rooms
    socket.on('joinRoom', async (roomId: number) => {
      socket.join(`room:${roomId}`);
      const roomMessages = await db.query.messages.findMany({
        where: eq(messages.roomId, roomId),
        orderBy: (messages, { desc }) => [desc(messages.createdAt)],
        limit: 50,
      });
      socket.emit('roomHistory', roomMessages);
    });

    // Handle leaving chat rooms
    socket.on('leaveRoom', (roomId: number) => {
      socket.leave(`room:${roomId}`);
    });

    // Handle chat room messages
    socket.on('roomMessage', async (message: ChatMessage) => {
      const newMessage = await db.insert(messages).values({
        roomId: message.roomId,
        senderId: message.senderId,
        content: message.content,
        type: message.type,
        metadata: message.metadata,
      }).returning();

      io.to(`room:${message.roomId}`).emit('newMessage', newMessage[0]);

      // Create notification for room participants
      const participants = await db.query.chatParticipants.findMany({
        where: eq(chatParticipants.roomId, message.roomId!),
      });

      for (const participant of participants) {
        if (participant.userId !== message.senderId) {
          await db.insert(notifications).values({
            userId: participant.userId,
            type: 'message',
            content: `New message in room ${message.roomId}`,
            metadata: { messageId: newMessage[0].id },
          });
        }
      }
    });

    // Handle direct messages
    socket.on('directMessage', async (message: ChatMessage) => {
      const newMessage = await db.insert(directMessages).values({
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        type: message.type,
        metadata: message.metadata,
      }).returning();

      // Send to sender
      socket.emit('newDirectMessage', newMessage[0]);

      // Send to receiver if online
      const receiverSocketId = onlineUsers.get(message.receiverId!);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newDirectMessage', newMessage[0]);
      }

      // Create notification for receiver
      await db.insert(notifications).values({
        userId: message.receiverId!,
        type: 'directMessage',
        content: 'New direct message',
        metadata: { messageId: newMessage[0].id },
      });
    });

    // Handle typing indicators
    socket.on('typing', ({ roomId, userId, isTyping }) => {
      if (roomId) {
        socket.to(`room:${roomId}`).emit('userTyping', { userId, isTyping });
      }
    });

    // Handle read receipts
    socket.on('messageRead', async ({ messageId, userId }) => {
      await db.update(directMessages)
        .set({ isRead: true })
        .where(and(
          eq(directMessages.id, messageId),
          eq(directMessages.receiverId, userId)
        ));

      const message = await db.query.directMessages.findFirst({
        where: eq(directMessages.id, messageId),
      });

      if (message) {
        const senderSocketId = onlineUsers.get(message.senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit('messageRead', { messageId, userId });
        }
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      let disconnectedUserId: number | undefined;
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          break;
        }
      }

      if (disconnectedUserId) {
        onlineUsers.delete(disconnectedUserId);
        io.emit('userStatus', { userId: disconnectedUserId, status: 'offline' });
      }

      console.log('User disconnected:', socket.id);
    });
  });

  return io;
} 