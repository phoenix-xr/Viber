
"use client";

import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/shared/navbar";
import { MatchCard } from "@/components/shared/match-card";
import { useUser, useCollection, useDoc } from "@/firebase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Map as MapIcon, Navigation, Search, Loader2, Info, Sparkles, MapPin, Globe, Zap, Crosshair, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// A high-fidelity Tactical Radar component
function ResonanceRadar({ matches, userCity }: { matches: any[], userCity: string }) {
  const [scanRotation, setScanRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanRotation(prev => (prev + 2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-video md:aspect-[21/9] glass rounded-[3rem] border-white/10 overflow-hidden bg-black/60 mb-12 group shadow-2xl">
      {/* Topology / Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#primary 1px, transparent 1px), linear-gradient(90deg, #primary 1px, transparent 1px)`,
             backgroundSize: '100px 100px',
             borderColor: 'rgba(159,117,255,0.1)'
           }} 
      />
      
      {/* Scanning Sweep Line */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `conic-gradient(from ${scanRotation}deg, transparent, rgba(159,117,255,0.2) 10%, transparent 20%)`,
        }}
      />
      
      {/* Tactical Crosshair Sweep */}
      <div 
        className="absolute top-1/2 left-1/2 w-full h-[1px] bg-primary/20 pointer-events-none z-10"
        style={{ transform: `translate(-50%, -50%) rotate(${scanRotation}deg)` }}
      />

      {/* Radar Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[0.5, 1, 1.5, 2, 2.5].map((ring) => (
          <div
            key={ring}
            className="absolute border border-primary/10 rounded-full"
            style={{ width: `${ring * 20}%`, height: `${ring * 40}%` }}
          />
        ))}
      </div>

      {/* Map Content */}
      <div className="relative z-20 w-full h-full p-12 flex items-center justify-center">
        <div className="text-center mb-8 absolute top-8 left-8 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
            <Activity className="w-3 h-3 animate-pulse" />
            Signal Analysis Active
          </div>
          <h3 className="text-xl font-headline font-bold text-white/90">Sector: {userCity.toUpperCase()}</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Coords: 51.5074° N, 0.1278° W</p>
        </div>

        <TooltipProvider>
          <div className="relative w-full h-full">
            {/* User Center Point */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <div className="w-6 h-6 bg-primary rounded-full shadow-[0_0_30px_rgba(159,117,255,1)] animate-pulse flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div className="absolute -inset-8 border border-primary/10 rounded-full animate-spin-slow" />
              <div className="absolute -inset-16 border border-white/5 rounded-full animate-spin-slow reverse" />
            </div>

            {/* Match Points (Radar Blips) */}
            {matches.map((match, idx) => {
              const isNearby = match.city === userCity;
              const angle = (idx * (360 / matches.length)) * (Math.PI / 180);
              const distance = isNearby ? (15 + Math.random() * 15) : (55 + Math.random() * 25);
              
              return (
                <Tooltip key={match.id} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                        x: Math.cos(angle) * distance + '%',
                        y: Math.sin(angle) * distance + '%',
                      }}
                      whileHover={{ scale: 1.4, zIndex: 50 }}
                      className="absolute top-1/2 left-1/2 cursor-pointer group/blip"
                    >
                      <Link href={`/matches/${match.id}`}>
                        <div className="relative">
                          {/* Pulse Effect */}
                          <div className={`absolute -inset-2 rounded-full animate-ping opacity-20 ${isNearby ? 'bg-primary' : 'bg-secondary'}`} />
                          <div className={`w-4 h-4 rounded-full border-2 border-white/20 shadow-lg transition-all ${isNearby ? 'bg-primary' : 'bg-secondary'} group-hover/blip:shadow-primary/50 group-hover/blip:scale-110`} />
                        </div>
                      </Link>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent className="glass border-white/10 p-4 rounded-2xl bg-black/90 backdrop-blur-2xl shadow-2xl min-w-[200px]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shadow-inner">
                        <img src={match.profileImage || match.imageUrl} alt={match.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                           <p className="text-sm font-bold text-white">{match.name}, {match.age}</p>
                           <span className="text-[10px] font-mono text-primary">{match.compatibilityScore}%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{match.city}</p>
                        </div>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </div>

      {/* Interface Decorations */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-2 pointer-events-none">
        <div className="font-mono text-[9px] text-primary/60 text-right">
          SIGNAL_STRENGTH: OPTIMAL<br />
          DIMENSIONAL_OFFSET: +0.0042<br />
          RESONANCE_SCAN: COMPLETE
        </div>
        <div className="flex gap-4 mt-2 justify-end">
          <div className="flex items-center gap-2 text-[8px] font-bold text-primary uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(159,117,255,0.8)]" />
            Local Signal
          </div>
          <div className="flex items-center gap-2 text-[8px] font-bold text-secondary uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(84,122,255,0.8)]" />
            Global Drift
          </div>
        </div>
      </div>

      {/* Scanning HUD bars */}
      <div className="absolute top-8 right-8 flex gap-1 items-end pointer-events-none opacity-40">
        {[4, 7, 5, 9, 3, 6, 8].map((h, i) => (
          <motion.div 
            key={i}
            animate={{ height: [h*2, h*4, h*2] }}
            transition={{ duration: 1 + Math.random(), repeat: Infinity }}
            className="w-1 bg-primary/40 rounded-t-sm"
          />
        ))}
      </div>
    </div>
  );
}

export default function MapPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  const profileQuery = useMemo(() => 
    user ? { collection: 'users', id: user.uid } : null
  , [user?.uid]);
  const { data: profile } = useDoc(profileQuery);

  const { data: allUsers, loading: usersLoading } = useCollection({ collection: 'users' });
  
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
              <span>Vector Mapping Interface</span>
            </div>
            <h1 className="font-headline text-5xl font-bold mb-4 tracking-tight">Geographic Resonance</h1>
            <div className="flex items-center gap-3 glass py-2.5 px-6 rounded-full border-white/10 w-fit shadow-xl">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Stationed at <span className="text-primary font-bold">{userCity}</span></span>
            </div>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-2xl glass border-white/10 h-14 gap-3 px-8 font-bold uppercase tracking-widest text-xs">
                <Search className="w-4 h-4" /> Expand Sensor Radius
             </Button>
          </div>
        </header>

        {/* The Tactical Radar Visualization */}
        <ResonanceRadar matches={allFilteredMatches} userCity={userCity} />

        <section className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-headline font-bold">Local Proximity Signals</h2>
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
              <p className="text-muted-foreground font-medium">No signals detected in {userCity} matching your current vector.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Try refining your Soul Vector or broadening your interests.</p>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-2 mb-8">
            <Globe className="w-5 h-5 text-secondary" />
            <h2 className="text-2xl font-headline font-bold">Global Resonance Feed</h2>
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
                  <div className="mt-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-4 flex items-center gap-2">
                    <Globe className="w-3 h-3 text-secondary/60" />
                    Transmitting from {match.city}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <div className="mt-20 p-12 glass rounded-[3rem] border-white/5 relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 text-center">
          <div className="relative z-10">
            <Info className="w-10 h-10 text-primary mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4 font-headline">The Resonance Radar</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-lg">
              Unlike traditional maps based purely on GPS, our Tactical Radar plots users in a combined Geosemantic Space. The Y-axis represents physical distance, while the X-axis represents your shared cognitive harmonic. Closer to the center means they are both physically and spiritually near.
            </p>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 rounded-full blur-[120px] opacity-10 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
