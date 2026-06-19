
"use client";

import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/shared/navbar";
import { MatchCard } from "@/components/shared/match-card";
import { useUser, useCollection, useDoc } from "@/firebase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Map as MapIcon, Navigation, Search, Loader2, Info, Sparkles, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MapPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  // Fetch current user's profile to know their city
  const profileQuery = useMemo(() => 
    user ? { collection: 'users', id: user.uid } : null
  , [user?.uid]);
  const { data: profile } = useDoc(profileQuery);

  // Fetch all users
  const { data: allUsers, loading: usersLoading } = useCollection({ collection: 'users' });
  
  // Fetch interactions to exclude passed/liked users if desired (optional for map view)
  const { data: interactions } = useCollection(
    user ? { collection: 'interactions', where: ['userId', '==', user.uid] } : null
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const userCity = profile?.city || "London";

  const nearbyMatches = useMemo(() => {
    if (!allUsers || !user) return [];
    
    const ignoredIds = (interactions || [])
      .filter(i => i.type === 'pass' || i.type === 'like')
      .map(i => i.targetUserId);

    return allUsers
      .filter(u => u.id !== user.uid)
      .filter(u => !ignoredIds.includes(u.id))
      .filter(u => u.city === userCity)
      .map(u => ({
        ...u,
        compatibilityScore: u.compatibilityScore || Math.floor(Math.random() * 15) + 85,
        imageUrl: u.profileImage || `https://picsum.photos/seed/${u.id}/500/700`,
      }));
  }, [allUsers, user, userCity, interactions]);

  const otherMatches = useMemo(() => {
    if (!allUsers || !user) return [];
    
    const ignoredIds = (interactions || [])
      .filter(i => i.type === 'pass' || i.type === 'like')
      .map(i => i.targetUserId);

    return allUsers
      .filter(u => u.id !== user.uid)
      .filter(u => !ignoredIds.includes(u.id))
      .filter(u => u.city !== userCity)
      .map(u => ({
        ...u,
        compatibilityScore: u.compatibilityScore || Math.floor(Math.random() * 10) + 75,
        imageUrl: u.profileImage || `https://picsum.photos/seed/${u.id}/500/700`,
      }));
  }, [allUsers, user, userCity, interactions]);

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
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
              <Navigation className="w-3 h-3" />
              <span>Geographic Discovery</span>
            </div>
            <h1 className="font-headline text-4xl font-bold mb-4 tracking-tight">Nearby Resonance</h1>
            <div className="flex items-center gap-3 glass py-2 px-4 rounded-full border-white/10 w-fit">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Matches in <span className="text-primary font-bold">{userCity}</span></span>
            </div>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-2xl glass border-white/10 h-12 gap-2">
                <Search className="w-4 h-4" /> Change Location
             </Button>
          </div>
        </header>

        <section className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-headline font-bold">Resonating Near You</h2>
          </div>
          
          {nearbyMatches.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {nearbyMatches.map((match) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <MatchCard match={match} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20 glass rounded-[3rem] border-white/5 bg-white/5">
              <Navigation className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No one in {userCity} matches your current filters.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Try expanding your search or updating your Soul Vector.</p>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-2 mb-8">
            <Globe className="w-5 h-5 text-secondary" />
            <h2 className="text-2xl font-headline font-bold">Global Vibrations</h2>
          </div>
          
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {otherMatches.map((match) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <MatchCard match={match} />
                  <div className="mt-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-4">
                    Residing in {match.city}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <div className="mt-20 p-12 glass rounded-[3rem] border-white/5 relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 text-center">
          <div className="relative z-10">
            <Info className="w-10 h-10 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4 font-headline">The Soulmatter Map</h3>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              We're building an interactive high-dimensional map that shows how your soul essence vibrates relative to others in your city. Real-time proximity discovery coming in the next evolution.
            </p>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-[120px] opacity-20 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
