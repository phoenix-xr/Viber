
"use client";

import { Navbar } from "@/components/shared/navbar";
import { MatchCard } from "@/components/shared/match-card";
import { useCollection, useUser } from "@/firebase";
import { motion } from "framer-motion";
import { Bookmark, Loader2 } from "lucide-react";
import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SavedMatchesPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Fetch interactions of type 'save'
  const { data: savedInteractions, loading: interactionsLoading } = useCollection({
    collection: 'interactions',
    where: ['type', '==', 'save']
  });

  const { data: allUsers, loading: usersLoading } = useCollection({ collection: 'users' });

  const filteredMatches = useMemo(() => {
    if (!savedInteractions || !allUsers) return [];
    const savedIds = savedInteractions.map(i => i.targetUserId);
    
    return allUsers
      .filter(u => savedIds.includes(u.id))
      .map(u => ({
        ...u,
        compatibilityScore: 90,
        imageUrl: `https://picsum.photos/seed/${u.id}/500/700`,
      }));
  }, [savedInteractions, allUsers]);

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
      
      <div className="max-w-7xl mx-auto pt-32 px-4">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
            <Bookmark className="w-3 h-3" />
            <span>Curated Soul Collection</span>
          </div>
          <h1 className="font-headline text-4xl font-bold mb-4">Saved Connections</h1>
          <p className="text-muted-foreground">People you've saved to explore further.</p>
        </header>

        {filteredMatches.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMatches.map((match: any) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 glass rounded-[2.5rem] border-white/5">
            <Bookmark className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground">Your saved list is empty. Go find some resonance!</p>
          </div>
        )}
      </div>
    </div>
  );
}
