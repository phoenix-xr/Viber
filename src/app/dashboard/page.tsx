
"use client";

import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Heart, MessageSquare, Zap, Activity, User, Settings, Sparkles, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { doc } from "firebase/firestore";

export default function DashboardPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const userDocRef = useMemo(() => (user && db ? doc(db, "users", user.uid) : null), [user, db]);
  const { data: profile, loading: profileLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (!authLoading && user && profile && !profile.onboarded) {
      router.push("/onboarding");
    }
  }, [user, authLoading, profile, router]);

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
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-headline text-4xl font-bold mb-2">Welcome back, {profile?.name || "Explorer"}</h1>
            <p className="text-muted-foreground">Your Soul Vector is active and finding new connections.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl glass border-white/10 gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Link href="/onboarding">
              <Button className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Sparkles className="w-4 h-4" />
                Update Vector
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 glass rounded-[2rem] p-8 border-white/5 relative overflow-hidden flex flex-col justify-between h-[400px]">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                <TrendingUp className="w-3 h-3" />
                Soul Identity Live
              </div>
              <h2 className="text-4xl font-headline font-bold mb-4">Your essence is <br /><span className="text-primary">evolving daily</span>.</h2>
              <p className="text-muted-foreground max-w-sm">Our AI detected a refined semantic resonance based on your recent activity.</p>
              
              <div className="mt-6 p-4 glass bg-white/5 rounded-2xl border-white/5 max-w-md">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Soul Vector Essence</h4>
                <p className="text-sm italic line-clamp-2">"{profile?.soulVector || "Still refining your unique signal..."}"</p>
              </div>
            </div>

            <div className="flex gap-4 relative z-10 mt-8">
              <Link href="/matches">
                <Button size="lg" className="rounded-xl bg-white text-black hover:bg-white/90 font-bold px-8">Find Resonance</Button>
              </Link>
            </div>

            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-primary rounded-full blur-[120px] opacity-20" />
            <div className="absolute top-10 right-10 w-32 h-32 glass border-white/10 rounded-3xl flex items-center justify-center rotate-12">
              <Zap className="w-12 h-12 text-primary animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="glass rounded-[2rem] p-6 border-white/5 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground text-sm font-medium">Profile Sync</p>
                <span className="text-primary font-bold">Active</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[100%] h-full bg-primary" />
              </div>
            </div>

            <div className="glass rounded-[2rem] p-6 border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Active Likes</p>
              </div>
            </div>

            <div className="glass rounded-[2rem] p-6 border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">New Messages</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
