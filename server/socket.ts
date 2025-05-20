import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Socket } from 'socket.io';
import { verifyToken } from './jwt';
import { db } from './db';
import { chatMessages, chatRooms } from '../shared/schema';
import { eq } from 'drizzle-orm';

interface AuthenticatedSocket extends Socket {
  userId?: number;
}

export function setupSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3050',
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = await verifyToken(token);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Track online users
  const onlineUsers = new Set<number>();

  io.on('connection', (socket: AuthenticatedSocket) => {
    if (!socket.userId) return;

    // Add user to online users
    onlineUsers.add(socket.userId);
    io.emit('online_users', Array.from(onlineUsers));

    // Handle joining a room
    socket.on('join_room', async (roomId: number) => {
      socket.join(`room:${roomId}`);
      
      // Send message history for the room
      const roomMessages = await db.query.chatMessages.findMany({
        where: eq(chatMessages.roomId, roomId),
        orderBy: (messages, { asc }) => [asc(messages.createdAt)],
      });
      
      socket.emit('message_history', roomMessages);
    });

    // Handle leaving a room
    socket.on('leave_room', (roomId: number) => {
      socket.leave(`room:${roomId}`);
    });

    // Handle sending messages
    socket.on('message', async (data: {
      content: string;
      roomId: number;
    }) => {
      if (!socket.userId) return;

      const message = await db.insert(chatMessages).values({
        content: data.content,
        userId: socket.userId,
        roomId: data.roomId,
        createdAt: new Date(),
      }).returning();

      // Room message
      io.to(`room:${data.roomId}`).emit('message', message[0]);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit('online_users', Array.from(onlineUsers));
      }
    });
  });

  return io;
} 