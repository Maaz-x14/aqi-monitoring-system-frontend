import api from './axios';
import { ChatRequest, ChatResponse, ChatMessage } from '../types/chat';

// Helper to convert UI messages to API DTO format
const formatHistory = (messages: ChatMessage[]) => {
    return messages.map(m => ({
        role: m.role,
        content: m.text
    }));
};

export const sendChatMessage = async (message: string, history: ChatMessage[]): Promise<ChatResponse> => {
  const payload = {
      message,
      history: formatHistory(history) // Send previous messages
  };
  
  const response = await api.post<ChatResponse>('/chat/ask', payload);
  return response.data;
};