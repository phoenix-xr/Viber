
"use client";

import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/shared/navbar";
import { MatchCard } from "@/components/shared/match-card";
import { useUser, useCollection, useDoc } from "@/firebase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Map as MapIcon, Navigation, Search, Loader2, Info, Sparkles, MapPin, Globe, Zap, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// A stylized Radar component to represent the "actual map" of resonance
function ResonanceRadar({ matches, userCity }: { matches: any[], userCity: string }) {
  return (
    <div className="relative w-full aspect-video md:aspect-[21/9] glass rounded-[3rem] border-white/10 overflow-hidden bg-black/40 mb-12 group">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle, #9F75FF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Radar Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: [0, 0.2, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: ring * 1.3 }}
            className="absolute border border-primary/40 rounded-full"
            style={{ width: `${ring * 30}%`, height: `${ring * 60}%` }}
          />
        ))}
      </div>

      {/* Map Content */}
      <div className="relative z-10 w-full h-full p-12 flex items-center justify-center">
        <div className="text-center mb-8 absolute top-8 left-1/2 -translate-x-1/2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
            <Zap className="w-3 h-3" />
            Live Resonance Scanning
          </div>
          <h3 className="text-sm font-bold opacity-60 uppercase tracking-tighter">Scanning for signals near {userCity}</h3>
        </div>

        <TooltipProvider>
          <div className="relative w-full h-full">
            {/* User Center Point */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_rgba(159,117,255,0.8)] animate-pulse" />
              <div className="absolute -inset-4 border border-primary/20 rounded-full animate-spin-slow" />
            </div>

            {/* Match Points */}
            {matches.map((match, idx) => {
              // Generate semi-random positions based on city vs other
              const isNearby = match.city === userCity;
              const angle = (idx * (360 / matches.length)) * (Math.PI / 180);
              const distance = isNearby ? (20 + Math.random() * 20) : (60 + Math.random() * 20);
              
              return (
                <Tooltip key={match.id}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                        x: Math.cos(angle) * distance + '%',
                        y: Math.sin(angle) * distance + '%',
                      }}
                      whileHover={{ scale: 1.5, zIndex: 30 }}
                      className="absolute top-1/2 left-1/2 cursor-pointer"
                    >
                      <Link href={`/matches/${match.id}`}>
                        <div className={`w-3 h-3 rounded-full border-2 border-background shadow-lg transition-colors ${isNearby ? 'bg-primary' : 'bg-secondary'}`} />
                      </Link>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent className="glass border-white/10 p-3 rounded-xl bg-black/80 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10">
                        <img src={match.profileImage || match.imageUrl} alt={match.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">{match.name}, {match.age}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{match.compatibilityScore}% Match</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </div>

      {/* Radar Overlay Decorations */}
      <div className="absolute bottom-8 right-8 text-right font-code text-[10px] text-primary/40 leading-tight hidden md:block">
        LAT: 51.5074 N<br />
        LONG: 0.1278 W<br />
        RESONANCE: ACTIVE
      </div>
      <div className="absolute top-8 left-8 flex gap-2">
         <div className="flex items-center gap-1.5 text-[8px] font-bold text-primary uppercase tracking-[0.2em]">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Local
         </div>
         <div className="flex items-center gap-1.5 text-[8px] font-bold text-secondary uppercase tracking-[0.2em]">
            <div className="w-2 h-2 rounded-full bg-secondary" />
            Global
         </div>
      </div>
    </div>
  );
}

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
  
  // Fetch interactions to exclude passed/liked users
  const { data: interactions } = useCollection(
    user ? { collection: 'interactions', where: ['userId', '==', user.uid] } : null
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const userCity = profile?.city || "London";

  const allFilteredMatches = useMemo(() => {
    if (!allUsers || !user) return [];
    
    const ignoredIds = (interactions || [])
      .filter(i => i.type === 'pass' || i.type === 'like')
      .map(i => i.targetUserId);

    return allUsers
      .filter(u => u.id !== user.uid)
      .filter(u => !ignoredIds.includes(u.id))
      .map(u => ({
        ...u,
        compatibilityScore: u.compatibilityScore || Math.floor(Math.random() * 20) + 80,
        imageUrl: u.profileImage || `https://picsum.photos/seed/${u.id}/500/700`,
      }));
  }, [allUsers, user, interactions]);

  const nearbyMatches = useMemo(() => {
    return allFilteredMatches.filter(u => u.city === userCity);
  }, [allFilteredMatches, userCity]);

  const otherMatches = useMemo(() => {
    return allFilteredMatches.filter(u => u.city !== userCity);
  }, [allFilteredMatches, userCity]);

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
              <Crosshair className="w-3 h-3" />
              <span>Vector Mapping</span>
            </div>
            <h1 className="font-headline text-5xl font-bold mb-4 tracking-tight">Resonance Map</h1>
            <div className="flex items-center gap-3 glass py-2 px-4 rounded-full border-white/10 w-fit">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Scanning around <span className="text-primary font-bold">{userCity}</span></span>
            </div>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-2xl glass border-white/10 h-12 gap-2">
                <Search className="w-4 h-4" /> Expand Radius
             </Button>
          </div>
        </header>

        {/* The Actual "Map" Visualization */}
        <ResonanceRadar matches={allFilteredMatches} userCity={userCity} />

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
            <h3 className="text-2xl font-bold mb-4 font-headline">Geographic vs. Semantic Map</h3>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              While the list shows geographic groupings, our Resonance Radar plots users based on the high-dimensional proximity of your Soul Vectors. The closer they appear to the center, the higher the cognitive alignment.
            </p>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-[120px] opacity-20 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
