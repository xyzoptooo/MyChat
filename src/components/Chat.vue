<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>Socket.IO Chat</h2>
      <div v-if="!username" class="username-input">
        <input 
          v-model="tempUsername" 
          @keyup.enter="joinChat"
          placeholder="Enter your username"
          class="username-field"
        />
        <button @click="joinChat" class="join-btn">Join Chat</button>
      </div>
      <div v-else class="user-info">
        <span>Welcome, {{ username }}!</span>
        <button @click="leaveChat" class="leave-btn">Leave</button>
      </div>
    </div>

    <div class="chat-messages" ref="messagesContainer">
      <div 
        v-for="message in messages" 
        :key="message.id"
        :class="['message', message.username === username ? 'own-message' : 'other-message']"
      >
        <div class="message-header">
          <span class="username">{{ message.username }}</span>
          <span class="timestamp">{{ message.timestamp }}</span>
        </div>
        <div class="message-content">{{ message.message }}</div>
      </div>
    </div>

    <div v-if="username" class="chat-input">
      <input 
        v-model="newMessage" 
        @keyup.enter="sendMessage"
        placeholder="Type a message..."
        class="message-input"
      />
      <button @click="sendMessage" class="send-btn">Send</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: number;
  username: string;
  message: string;
  timestamp: string;
}

const socket = ref<Socket | null>(null);
const username = ref('');
const tempUsername = ref('');
const newMessage = ref('');
const messages = ref<Message[]>([]);
const messagesContainer = ref<HTMLElement>();

// Initialize socket connection
onMounted(() => {
  socket.value = io('http://localhost:3001');
  
  socket.value.on('newMessage', (message: Message) => {
    messages.value.push(message);
    scrollToBottom();
  });
  
  socket.value.on('userJoined', (joinedUsername: string) => {
    messages.value.push({
      id: Date.now(),
      username: 'System',
      message: `${joinedUsername} joined the chat`,
      timestamp: new Date().toLocaleTimeString()
    });
  });
  
  socket.value.on('userLeft', (leftUsername: string) => {
    messages.value.push({
      id: Date.now(),
      username: 'System',
      message: `${leftUsername} left the chat`,
      timestamp: new Date().toLocaleTimeString()
    });
  });
});

// Clean up socket connection
onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});

const joinChat = () => {
  if (tempUsername.value.trim()) {
    username.value = tempUsername.value.trim();
    socket.value?.emit('join', username.value);
    tempUsername.value = '';
  }
};

const leaveChat = () => {
  username.value = '';
  messages.value = [];
  socket.value?.disconnect();
  socket.value = io('http://localhost:3001');
};

const sendMessage = () => {
  if (newMessage.value.trim() && socket.value) {
    socket.value.emit('sendMessage', newMessage.value.trim());
    newMessage.value = '';
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.chat-header {
  background: #007bff;
  color: white;
  padding: 1rem;
  text-align: center;
}

.username-input {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.username-field, .message-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.join-btn, .leave-btn, .send-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.join-btn {
  background: #28a745;
  color: white;
}

.leave-btn {
  background: #dc3545;
  color: white;
  margin-left: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #f8f9fa;
}

.message {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  max-width: 70%;
}

.own-message {
  background: #007bff;
  color: white;
  margin-left: auto;
}

.other-message {
  background: #e9ecef;
  color: #333;
  margin-right: auto;
}

.message-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.username {
  font-weight: bold;
}

.timestamp {
  color: #666;
}

.chat-input {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border-top: 1px solid #ddd;
}

.send-btn {
  background: #007bff;
  color: white;
}

.send-btn:hover {
  background: #0056b3;
}
</style>
