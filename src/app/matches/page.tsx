
"use client";

import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/shared/navbar";
import { MatchCard } from "@/components/shared/match-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Loader2, 
  Music as MusicIcon,
  X,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, useCollection } from "@/firebase";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MatchesPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Fetch mock users
  const { data: allUsers, loading: usersLoading } = useCollection({ collection: 'users' });
  
  // Fetch interactions to filter out passed or liked users
  const { data: interactions, loading: interactionsLoading } = useCollection(
    user ? { collection: 'interactions', where: ['userId', '==', user.uid] } : null
  );

  // Dynamically extract cities from all users to populate the filter
  const cities = useMemo(() => {
    if (!allUsers) return [];
    const uniqueCities = Array.from(new Set(allUsers.map(u => u.city).filter(Boolean)));
    return uniqueCities.sort();
  }, [allUsers]);

  const filteredMatches = useMemo(() => {
    if (!allUsers || !user) return [];
    
    // Get list of IDs that the user has already 'passed' or 'liked'
    const ignoredIds = (interactions || [])
      .filter(i => i.type === 'pass' || i.type === 'like')
      .map(i => i.targetUserId);

    return allUsers
      .filter(u => u.id !== user.uid)
      .filter(u => !ignoredIds.includes(u.id))
      .filter(m => {
        const matchesSearch = 
          (m.name?.toLowerCase() || "").includes(search.toLowerCase()) || 
          (m.interests || []).some((i: string) => i.toLowerCase().includes(search.toLowerCase()));
        
        const matchesCity = !selectedCity || m.city === selectedCity;
        
        return matchesSearch && matchesCity;
      })
      .map(u => ({
        ...u,
        compatibilityScore: u.compatibilityScore || Math.floor(Math.random() * 15) + 85,
        imageUrl: `https://picsum.photos/seed/${u.id}/500/700`,
      }));
  }, [allUsers, user, search, interactions, selectedCity]);

  if (authLoading || (usersLoading && !allUsers) || (interactionsLoading && !interactions)) {
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
          <h1 className="font-headline text-4xl font-bold mb-4 tracking-tight">Semantic Matches</h1>
          <p className="text-muted-foreground text-lg">Based on your Soul Vector and music tastes, these individuals resonate most with your profile.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or interests (e.g. 'Jazz', 'AI')..." 
              className="pl-11 h-14 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-14 rounded-2xl glass border-white/10 gap-3 px-6 font-bold uppercase tracking-widest text-xs">
                  <MapPin className="w-4 h-4" />
                  {selectedCity || "All Cities"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass border-white/10 bg-black/80 backdrop-blur-xl">
                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Filter by Location</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem onClick={() => setSelectedCity(null)} className="cursor-pointer">
                  All Cities
                </DropdownMenuItem>
                {cities.length > 0 ? cities.map(city => (
                  <DropdownMenuItem key={city} onClick={() => setSelectedCity(city)} className="cursor-pointer">
                    {city}
                  </DropdownMenuItem>
                )) : (
                  <DropdownMenuItem disabled className="text-muted-foreground text-xs italic">No cities available</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {(search || selectedCity) && (
              <Button 
                variant="ghost" 
                onClick={() => { setSearch(""); setSelectedCity(null); }}
                className="h-14 w-14 rounded-2xl border border-white/5 hover:bg-white/5 text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMatches.map((match) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <MatchCard match={match} />
                {(match.spotifyConnected || (match.music?.genres?.length > 0)) && (
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-[#1DB954] uppercase tracking-widest px-4">
                    <MusicIcon className="w-3 h-3" />
                    Music Profile Active
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredMatches.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-32 glass rounded-[3rem] border-white/5"
          >
            <Sparkles className="w-16 h-16 text-muted-foreground/10 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-2">No Resonance Found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              We couldn't find anyone matching your current filters. Try expanding your search or clearing your city filter.
            </p>
            <Button 
              variant="link" 
              onClick={() => { setSearch(""); setSelectedCity(null); }}
              className="mt-6 text-primary font-bold uppercase tracking-widest text-xs"
            >
              Clear all filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
