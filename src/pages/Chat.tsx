
// "use client"

// import type React from "react"

// import { useState, useEffect, useRef } from "react"
// import { useMutation } from "@tanstack/react-query"
// import { sendChatMessage } from "@/api/chatApi"
// import Navbar from "@/components/layout/Navbar"
// import { Button } from "@/components/ui/Button"
// import { Send, MessageSquare, User, Cloud } from "lucide-react"
// import { toast } from "sonner"

// interface ChatMessage {
//   id: string
//   role: "user" | "assistant"
//   text: string
// }

// export default function Chat() {
//   const [input, setInput] = useState("")
//   const [messages, setMessages] = useState<ChatMessage[]>([])
//   const messagesEndRef = useRef<HTMLDivElement>(null)

//   // Scroll to bottom on new message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages])

//   // React Query v5 Mutation
//   const mutation = useMutation({
//     mutationFn: (newMessage: string) => sendChatMessage(newMessage, messages),
//     onSuccess: (data) => {
//       const botMsg: ChatMessage = {
//         id: Date.now().toString(),
//         role: "assistant",
//         text: data.response,
//       }
//       setMessages((prev) => [...prev, botMsg])
//     },
//     onError: () => {
//       toast.error("Failed to get response from AI.")
//     },
//   })

//   const handleSend = () => {
//     if (!input.trim()) return

//     const userMsg: ChatMessage = {
//       id: Date.now().toString(),
//       role: "user",
//       text: input,
//     }

//     // Optimistic update: Show user message immediately
//     setMessages((prev) => [...prev, userMsg])
//     setInput("")

//     // Send to backend
//     mutation.mutate(userMsg.text)
//   }

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       handleSend()
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <Navbar />

//       <div className="sticky top-16 bg-white p-4 rounded-t-xl shadow-sm border-b border-gray-100 flex items-center gap-3 z-40 max-w-4xl w-full mx-auto left-0 right-0">
//         <div className="p-2 bg-blue-100 rounded-lg">
//           <MessageSquare className="w-5 h-5 text-blue-600" />
//         </div>
//         <div>
//           <h1 className="text-lg font-semibold text-gray-900">AI Health Assistant</h1>
//           <p className="text-xs text-gray-500">Powered by Groq & Live AQI Data</p>
//         </div>
//       </div>

//       <main className="flex-1 max-w-4xl w-full mx-auto flex flex-col">
//         <div className="h-[70dvh] bg-white overflow-y-auto p-4 space-y-4 shadow-sm">
//           {messages.length === 0 && (
//             <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
//               <Cloud className="w-16 h-16 mb-4" />
//               <p>Ask me anything about the air quality!</p>
//             </div>
//           )}

//           {messages.map((msg) => (
//             <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
//               <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-green-600 text-white"}`}
//                 >
//                   {msg.role === "user" ? <User className="w-5 h-5" /> : <Cloud className="w-5 h-5" />}
//                 </div>
//                 <div
//                   className={`p-3 rounded-2xl text-sm ${
//                     msg.role === "user"
//                       ? "bg-blue-600 text-white rounded-tr-none"
//                       : "bg-gray-100 text-gray-800 rounded-tl-none"
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//               </div>
//             </div>
//           ))}

//           {mutation.isPending && (
//             <div className="flex justify-start">
//               <div className="flex gap-3">
//                 <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
//                   <Cloud className="w-5 h-5 text-white" />
//                 </div>
//                 <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-sm text-gray-500 animate-pulse">
//                   Thinking...
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         <div className="bg-white p-4 rounded-b-xl shadow-sm border-t border-gray-100">
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyPress}
//               placeholder="Type your question..."
//               className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               disabled={mutation.isPending}
//             />
//             <Button
//               onClick={handleSend}
//               disabled={mutation.isPending || !input.trim()}
//               className="w-auto px-6 bg-blue-600 hover:bg-blue-700"
//             >
//               <Send className="w-4 h-4" />
//             </Button>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import { sendChatMessage } from "@/api/chatApi"
import Navbar from "@/components/layout/Navbar"
import { Button } from "@/components/ui/Button"
import { 
  SendHorizontal, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  Info,
  Wind
} from "lucide-react"
import { toast } from "sonner"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  text: string
}

const SUGGESTED_PROMPTS = [
  "What is the current AQI in my city?",
  "Is it safe to go jogging right now?",
  "What does High PM2.5 mean for my health?",
  "How can I improve indoor air quality?"
];

export default function Chat() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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

  const handleSend = (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: textToSend,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    mutation.mutate(userMsg.text)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    // 'h-screen' and 'overflow-hidden' on the outer container prevents page-level scrolling
    <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      <Navbar />

      {/* Main container centers the chat box */}
      <main className="flex-1 flex items-center justify-center p-4 sm:px-6 lg:px-8">
        
        {/* Chat Component Fixed Height: 70dvh */}
        <div className="w-full max-w-5xl h-[70dvh] flex flex-col bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border border-slate-200 overflow-hidden relative">
          
          {/* Header (Fixed) */}
          <div className="bg-white/90 backdrop-blur-md border-b border-slate-100 p-4 flex items-center gap-4 z-10">
            <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Bot className="w-6 h-6 text-white" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">Eco-Assistant</h1>
              <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                 <Sparkles className="w-3 h-3 text-amber-500" />
                 Online & Ready
              </p>
            </div>
          </div>

          {/* Messages Area (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth bg-slate-50/30">
            
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                  <Wind className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">How is the air today?</h2>
                <p className="text-sm text-slate-500 max-w-xs mb-8 mx-auto">
                  Ask about AQI, health tips, or forecasts.
                </p>

                <div className="grid grid-cols-1 gap-3 w-full max-w-md">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="text-left text-sm p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-700 transition-all duration-200 shadow-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === "user" ? "bg-slate-900" : "bg-blue-100"}`}>
                    {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-blue-600" />}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {mutation.isPending && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm">
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    <span className="text-sm text-slate-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area (Fixed) */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative flex items-center gap-2 bg-slate-50 p-1.5 rounded-full border border-slate-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-300">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-transparent px-4 py-2 text-slate-800 placeholder-slate-400 focus:outline-none text-sm"
                disabled={mutation.isPending}
              />
              <Button
                onClick={() => handleSend()}
                disabled={mutation.isPending || !input.trim()}
                className="rounded-full w-9 h-9 p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white shadow-md disabled:opacity-50 disabled:shadow-none transition-all"
              >
                {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendHorizontal className="w-4 h-4 ml-0.5" />}
              </Button>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  )
}