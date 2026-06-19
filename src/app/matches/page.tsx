
"use client";

import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/shared/navbar";
import { MatchCard } from "@/components/shared/match-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useUser, useCollection } from "@/firebase";
import { useRouter } from "next/navigation";

export default function MatchesPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Fetch mock users
  const { data: allUsers, loading: usersLoading } = useCollection({ collection: 'users' });

  const filteredMatches = useMemo(() => {
    if (!allUsers || !user) return [];
    
    // Default mock profiles if none exist in local storage yet
    const baseProfiles = allUsers.length > 0 ? allUsers : [
      { id: '1', name: 'Alex', age: 26, city: 'London', interests: ['AI', 'Jazz'], onboarded: true },
      { id: '2', name: 'Sam', age: 29, city: 'NYC', interests: ['Coding', 'Music'], onboarded: true },
      { id: '3', name: 'Jordan', age: 24, city: 'Berlin', interests: ['Art', 'Philosophy'], onboarded: true },
      { id: '4', name: 'Casey', age: 31, city: 'Tokyo', interests: ['Gaming', 'Photography'], onboarded: true },
    ];

    return baseProfiles
      .filter(u => u.id !== user.uid)
      .filter(m => 
        (m.name?.toLowerCase() || "").includes(search.toLowerCase()) || 
        (m.city?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (m.interests || []).some((i: string) => i.toLowerCase().includes(search.toLowerCase()))
      )
      .map(u => ({
        ...u,
        compatibilityScore: Math.floor(Math.random() * 20) + 80,
        imageUrl: `https://picsum.photos/seed/${u.id}/500/700`,
      }));
  }, [allUsers, user, search]);

  if (authLoading || usersLoading) {
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
            <Sparkles className="w-3 h-3" />
            <span>AI Powered Discovery</span>
          </div>
          <h1 className="font-headline text-4xl font-bold mb-4">Semantic Matches</h1>
          <p className="text-muted-foreground">Based on your Soul Vector, these individuals resonate most with your profile.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, city, or interests..." 
              className="pl-11 h-12 bg-white/5 border-white/10 rounded-xl focus-visible:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 rounded-xl glass border-white/10 gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </motion.div>

        {filteredMatches.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No matches found. Try refining your profile or search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
