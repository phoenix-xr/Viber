
"use client";

import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { useUser, useCollection, mockDb } from "@/firebase";
import { useState, useMemo, useEffect, useRef } from "react";
import { Send, User, ChevronLeft, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatDetailPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Parse the other user's ID from the composite chat ID
  const otherUserId = useMemo(() => {
    if (!id || !user) return null;
    const parts = (id as string).split("_");
    return parts.find(p => p !== user.uid) || null;
  }, [id, user]);

  // Fetch all users to find the name of the person we're chatting with
  const { data: allUsers, loading: usersLoading } = useCollection({ collection: 'users' });
  const otherUser = useMemo(() => {
    if (!allUsers || !otherUserId) return null;
    return allUsers.find(u => u.id === otherUserId);
  }, [allUsers, otherUserId]);

  // Fetch messages for this specific chat ID
  const { data: messages, loading: messagesLoading } = useCollection({
    collection: `chat_messages_${id}`,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !id) return;

    const text = inputText;
    setInputText("");

    mockDb.add(`chat_messages_${id}`, {
      text,
      senderId: user.uid,
      timestamp: new Date().toISOString(),
    });
  };

  if (authLoading || usersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

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
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center relative overflow-hidden">
                {otherUser?.profileImage ? (
                   <img 
                    src={otherUser.profileImage} 
                    alt={otherUser.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold">{otherUser?.name || "Match Connection"}</h3>
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
          {messagesLoading && (
            <div className="flex justify-center py-10">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
          )}
          
          <AnimatePresence initial={false}>
            {messages?.map((msg: any) => (
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
          
          {!messagesLoading && (!messages || messages.length === 0) && (
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
