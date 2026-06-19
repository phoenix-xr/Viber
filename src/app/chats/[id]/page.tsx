
"use client";

import { useParams } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { useState, useMemo, useEffect, useRef } from "react";
import { Send, User, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatDetailPage() {
  const { id } = useParams();
  const { user } = useUser();
  const db = useFirestore();
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const messagesQuery = useMemo(() => {
    if (!db || !id) return null;
    return query(collection(db, "chats", id as string, "messages"), orderBy("timestamp", "asc"));
  }, [db, id]);

  const { data: messages, loading } = useCollection(messagesQuery);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !db || !id) return;

    const text = inputText;
    setInputText("");

    await addDoc(collection(db, "chats", id as string, "messages"), {
      text,
      senderId: user.uid,
      timestamp: serverTimestamp(),
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto w-full pt-32 pb-6 px-4 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="glass p-4 rounded-t-3xl border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/chats">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-bold">Match Connection</h3>
                <span className="text-[10px] text-primary uppercase tracking-widest font-bold">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-1 glass bg-black/20 border-white/5 p-6 overflow-y-auto space-y-4 scroll-smooth"
        >
          {loading && (
            <div className="flex justify-center py-10">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
          )}
          
          <AnimatePresence>
            {messages?.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] p-4 rounded-2xl ${
                  msg.senderId === user?.uid 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'glass bg-white/5 border-white/10 rounded-tl-none'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {!loading && (!messages || messages.length === 0) && (
            <div className="text-center py-10">
              <p className="text-muted-foreground text-sm italic">Start the conversation with a semantic spark.</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="glass p-4 rounded-b-3xl border-white/10">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 h-12 bg-white/5 border-white/10 rounded-xl focus-visible:ring-primary"
            />
            <Button type="submit" size="icon" className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90">
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
