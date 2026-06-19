"use client";

import { Navbar } from "@/components/shared/navbar";
import { useUser, useCollection } from "@/firebase";
import { MessageSquare, Loader2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ChatsPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const { data: interactions, loading: interactionsLoading } = useCollection(
    user ? {
      collection: 'interactions',
      where: ['userId', '==', user.uid]
    } : null
  );

  const { data: allUsers, loading: usersLoading } = useCollection({ collection: 'users' });

  const activeChats = useMemo(() => {
    if (!interactions || !allUsers || !user) return [];
    
    const likedTargetIds = interactions
      .filter(i => i.type === 'like')
      .map(i => i.targetUserId);

    return allUsers
      .filter(u => likedTargetIds.includes(u.id))
      .map(u => ({
        id: [user.uid, u.id].sort().join("_"),
        otherUserName: u.name,
        lastMessage: "Start a conversation...",
        time: "Just matched",
        otherUserId: u.id
      }));
  }, [interactions, allUsers, user]);

  if (authLoading || (interactionsLoading && usersLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <div className="max-w-4xl mx-auto pt-32 px-4">
        <header className="mb-12">
          <h1 className="font-headline text-4xl font-bold mb-4">Messages</h1>
          <p className="text-muted-foreground">Deep conversations with your semantic matches.</p>
        </header>

        <div className="space-y-4">
          {activeChats.length > 0 ? activeChats.map((chat) => (
            <Link href={`/chats/${chat.id}`} key={chat.id}>
              <motion.div 
                whileHover={{ x: 10 }}
                className="glass p-6 rounded-2xl border-white/5 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/${chat.otherUserId}/200/200`} 
                      alt={chat.otherUserName}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{chat.otherUserName}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{chat.lastMessage}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{chat.time}</span>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </motion.div>
            </Link>
          )) : (
            <div className="text-center py-20 glass rounded-[2.5rem] border-white/5">
              <MessageSquare className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground">No active chats yet. Start matching to begin chatting!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}