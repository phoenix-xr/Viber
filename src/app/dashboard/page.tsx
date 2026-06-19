"use client";

import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Zap, Activity, Settings, Sparkles, TrendingUp, Music as MusicIcon, RefreshCw, ArrowRight, LogOut, BrainCircuit, Globe, User } from "lucide-react";
import Link from "next/link";
import { useUser, useDoc } from "@/firebase";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useUser();
  const router = useRouter();

  const profileQuery = useMemo(() => 
    user ? { collection: 'users', id: user.uid } : null
  , [user?.uid]);

  const { data: profile, loading: profileLoading } = useDoc(profileQuery);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (!authLoading && user && profile && !profile.onboarded) {
      router.push("/onboarding");
    }
  }, [user, authLoading, profile, router]);

  const handleSignOut = () => {
    logout();
    router.push("/");
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-32 px-4">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
              {profile?.profileImage ? (
                <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
                <BrainCircuit className="w-4 h-4" />
                <span>Identity Pulse</span>
              </div>
              <h1 className="font-headline text-5xl md:text-6xl font-bold mb-2 tracking-tight">Welcome, {profile?.name || "Explorer"}</h1>
              <p className="text-muted-foreground text-lg">Your Soul Vector is active and finding resonance.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-2xl glass border-white/10 gap-3 h-14 px-8 font-bold text-xs uppercase tracking-widest" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" /> Sign Out
            </Button>
            <Link href="/onboarding">
              <Button className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground gap-3 h-14 px-8 font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20">
                <RefreshCw className="w-5 h-5" />
                Update Vector
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 glass rounded-[3rem] p-12 border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[500px] group">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-8">
                <TrendingUp className="w-4 h-4" />
                Soul Identity Live
              </div>
              <h2 className="text-5xl font-headline font-bold mb-8 leading-tight">Your essence is <br /><span className="text-gradient">evolving daily</span>.</h2>
              
              <div className="mt-8 p-8 glass bg-white/5 rounded-3xl border-white/5 max-w-2xl relative">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  Soul Vector Essence
                </h4>
                <p className="text-xl italic leading-relaxed text-foreground font-medium">
                  "{profile?.soulVector || "Refining your unique signal. Update your profile to see your neural essence."}"
                </p>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Globe className="w-24 h-24" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 relative z-10 mt-12">
              <Link href="/matches">
                <Button size="lg" className="rounded-2xl bg-white text-black hover:bg-white/90 font-bold px-12 h-16 text-lg group shadow-2xl">
                  Find Resonance
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-[140px] opacity-30 pointer-events-none" />
          </div>

          <div className="flex flex-col gap-8">
            <div className="glass rounded-[3rem] p-10 border-white/5 flex flex-col justify-center flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Vector Stability</p>
                <span className="text-primary font-bold text-2xl tracking-tighter">98.4%</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "98.4%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-secondary" 
                />
              </div>
            </div>

            <div className="glass rounded-[3rem] p-8 border-white/5 flex items-center gap-6 hover:bg-white/5 transition-colors cursor-default group">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${profile?.spotifyConnected ? 'bg-[#1DB954]/10' : 'bg-white/5'}`}>
                <MusicIcon className={`w-8 h-8 ${profile?.spotifyConnected ? 'text-[#1DB954]' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className="text-xl font-bold leading-tight">{profile?.spotifyConnected ? "Spotify Linked" : "Manual Profile"}</p>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-1">Profile Enrichment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
