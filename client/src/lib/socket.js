import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket) {
      this.socket.disconnect();// Disconnect existing connection if any
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinRoom(userId) {
    if (this.socket) {
      this.socket.emit('join_room', userId);
    }
  }

  sendMessage(messageData) {
    if (this.socket) {
      this.socket.emit('send_message', messageData);
    }
  }

  onReceiveMessage(callback) {
    if (this.socket) {
      this.socket.on('receive_message', callback);
    }
  }

  offReceiveMessage(callback) {
    if (this.socket) {
      this.socket.off('receive_message', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  offUserTyping(callback) {
    if (this.socket) {
      this.socket.off('user_typing', callback);
    }
  }

  onUserStopTyping(callback) {
    if (this.socket) {
      this.socket.on('user_stop_typing', callback);
    }
  }

  offUserStopTyping(callback) {
    if (this.socket) {
      this.socket.off('user_stop_typing', callback);
    }
  }

  emitTyping(receiverId, senderId) {
    if (this.socket) {
      const payload =
        typeof receiverId === 'object'
          ? receiverId
          : { receiverId, senderId };
      this.socket.emit('typing', payload);
    }
  }

  emitStopTyping(receiverId, senderId) {
    if (this.socket) {
      const payload =
        typeof receiverId === 'object'
          ? receiverId
          : { receiverId, senderId };
      this.socket.emit('stop_typing', payload);
    }
  }

  // Backwards-compatible aliases used by components
  typing(receiverIdOrPayload, maybeSenderId) {
    this.emitTyping(receiverIdOrPayload, maybeSenderId);
  }

  stopTyping(receiverIdOrPayload, maybeSenderId) {
    this.emitStopTyping(receiverIdOrPayload, maybeSenderId);
  }

  getSocket() {
    return this.socket;
  }

  // Conversation delete events
  deleteConversation(payload) {
    if (this.socket) {
      this.socket.emit('delete_conversation', payload);
    }
  }

  onConversationDeleted(callback) {
    if (this.socket) {
      this.socket.on('conversation_deleted', callback);
    }
  }

  offConversationDeleted(callback) {
    if (this.socket) {
      this.socket.off('conversation_deleted', callback);
    }
  }

  // Message delete events
  deleteMessage(payload) {
    if (this.socket) {
      this.socket.emit('delete_message', payload);
    }
  }

  onMessageDeleted(callback) {
    if (this.socket) {
      this.socket.on('message_deleted', callback);
    }
  }

  offMessageDeleted(callback) {
    if (this.socket) {
      this.socket.off('message_deleted', callback);
    }
  }
}

export default new SocketService(); 