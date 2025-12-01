// import { useState, useEffect, useRef } from 'react';
// import { useMutation } from '@tanstack/react-query';
// import { sendChatMessage } from '@/api/chatApi';
// import Navbar from '@/components/layout/Navbar';
// import { Button } from '@/components/ui/Button';
// import { Send, MessageSquare, User, Cloud } from 'lucide-react';
// import { toast } from 'sonner';

// interface ChatMessage {
//     id: string;
//     role: 'user' | 'assistant';
//     text: string;
// }

// export default function Chat() {
//     const [input, setInput] = useState('');
//     const [messages, setMessages] = useState<ChatMessage[]>([]);
//     const messagesEndRef = useRef<HTMLDivElement>(null);

//     // Scroll to bottom on new message
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);

//     // React Query v5 Mutation
//     // React Query v5 Mutation
//     const mutation = useMutation({
//         // FIX: Pass arguments directly, not as an object
//         mutationFn: (newMessage: string) => sendChatMessage(newMessage, messages), 
//         onSuccess: (data) => {
//             const botMsg: ChatMessage = {
//                 id: Date.now().toString(),
//                 role: 'assistant',
//                 text: data.response
//             };
//             setMessages((prev) => [...prev, botMsg]);
//         },
//         onError: () => {
//             toast.error("Failed to get response from AI.");
//         }
//     });

//     const handleSend = () => {
//         if (!input.trim()) return;

//         const userMsg: ChatMessage = {
//             id: Date.now().toString(),
//             role: 'user',
//             text: input
//         };

//         // Optimistic update: Show user message immediately
//         setMessages((prev) => [...prev, userMsg]);
//         setInput('');
        
//         // Send to backend
//         mutation.mutate(userMsg.text);
//     };

//     const handleKeyPress = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSend();
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col">
//             <Navbar />
            
//             <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col h-[calc(100vh-64px)]">
//                 {/* Header */}
//                 <div className="bg-white p-4 rounded-t-xl shadow-sm border-b border-gray-100 flex items-center gap-3">
//                     <div className="p-2 bg-blue-100 rounded-lg">
//                         <MessageSquare className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <div>
//                         <h1 className="text-lg font-semibold text-gray-900">AI Health Assistant</h1>
//                         <p className="text-xs text-gray-500">Powered by Groq & Live AQI Data</p>
//                     </div>
//                 </div>

//                 {/* Chat Area */}
//                 <div className="flex-1 bg-white overflow-y-auto p-4 space-y-4 shadow-sm">
//                     {messages.length === 0 && (
//                         <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
//                             <Cloud className="w-16 h-16 mb-4" />
//                             <p>Ask me anything about the air quality!</p>
//                         </div>
//                     )}

//                     {messages.map((msg) => (
//                         <div 
//                             key={msg.id} 
//                             className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
//                         >
//                             <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
//                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
//                                     {msg.role === 'user' ? <User className="w-5 h-5" /> : <Cloud className="w-5 h-5" />}
//                                 </div>
//                                 <div className={`p-3 rounded-2xl text-sm ${
//                                     msg.role === 'user' 
//                                         ? 'bg-blue-600 text-white rounded-tr-none' 
//                                         : 'bg-gray-100 text-gray-800 rounded-tl-none'
//                                 }`}>
//                                     {msg.text}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}

//                     {mutation.isPending && (
//                         <div className="flex justify-start">
//                             <div className="flex gap-3">
//                                 <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
//                                     <Cloud className="w-5 h-5 text-white" />
//                                 </div>
//                                 <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-sm text-gray-500 animate-pulse">
//                                     Thinking...
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                     <div ref={messagesEndRef} />
//                 </div>

//                 {/* Input Area */}
//                 <div className="bg-white p-4 rounded-b-xl shadow-sm border-t border-gray-100">
//                     <div className="flex gap-2">
//                         <input
//                             type="text"
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             onKeyDown={handleKeyPress}
//                             placeholder="Type your question..."
//                             className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             disabled={mutation.isPending}
//                         />
//                         <Button 
//                             onClick={handleSend} 
//                             disabled={mutation.isPending || !input.trim()}
//                             className="w-auto px-6 bg-blue-600 hover:bg-blue-700"
//                         >
//                             <Send className="w-4 h-4" />
//                         </Button>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }



"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import { sendChatMessage } from "@/api/chatApi"
import Navbar from "@/components/layout/Navbar"
import { Button } from "@/components/ui/Button"
import { Send, MessageSquare, User, Cloud } from "lucide-react"
import { toast } from "sonner"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  text: string
}

export default function Chat() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // React Query v5 Mutation
  const mutation = useMutation({
    mutationFn: (newMessage: string) => sendChatMessage(newMessage, messages),
    onSuccess: (data) => {
      const botMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        text: data.response,
      }
      setMessages((prev) => [...prev, botMsg])
    },
    onError: () => {
      toast.error("Failed to get response from AI.")
    },
  })

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: input,
    }

    // Optimistic update: Show user message immediately
    setMessages((prev) => [...prev, userMsg])
    setInput("")

    // Send to backend
    mutation.mutate(userMsg.text)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="sticky top-16 bg-white p-4 rounded-t-xl shadow-sm border-b border-gray-100 flex items-center gap-3 z-40 max-w-4xl w-full mx-auto left-0 right-0">
        <div className="p-2 bg-blue-100 rounded-lg">
          <MessageSquare className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">AI Health Assistant</h1>
          <p className="text-xs text-gray-500">Powered by Groq & Live AQI Data</p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto flex flex-col">
        <div className="h-[70dvh] bg-white overflow-y-auto p-4 space-y-4 shadow-sm">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
              <Cloud className="w-16 h-16 mb-4" />
              <p>Ask me anything about the air quality!</p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-green-600 text-white"}`}
                >
                  {msg.role === "user" ? <User className="w-5 h-5" /> : <Cloud className="w-5 h-5" />}
                </div>
                <div
                  className={`p-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-gray-100 text-gray-800 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {mutation.isPending && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-sm text-gray-500 animate-pulse">
                  Thinking...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white p-4 rounded-b-xl shadow-sm border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your question..."
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={mutation.isPending}
            />
            <Button
              onClick={handleSend}
              disabled={mutation.isPending || !input.trim()}
              className="w-auto px-6 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
