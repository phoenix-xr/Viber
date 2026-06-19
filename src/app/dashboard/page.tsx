"use client";

import { Navbar } from "@/components/shared/navbar";
import { CompatibilityRing } from "@/components/ui/compatibility-ring";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Heart, MessageSquare, Zap, Activity, User, Settings, Sparkles, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-32 px-4">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-headline text-4xl font-bold mb-2">Welcome back, Alex</h1>
            <p className="text-muted-foreground">Your Soul Vector is active and finding new connections.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl glass border-white/10 gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Sparkles className="w-4 h-4" />
              Recalculate Vector
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Main Stat Card */}
          <div className="md:col-span-2 glass rounded-[2rem] p-8 border-white/5 relative overflow-hidden flex flex-col justify-between h-[400px]">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                <TrendingUp className="w-3 h-3" />
                Live Matching Active
              </div>
              <h2 className="text-4xl font-headline font-bold mb-4">You have <span className="text-primary">12 new matches</span> <br />this week.</h2>
              <p className="text-muted-foreground max-w-sm">Our AI detected a 15% increase in compatibility with new users in your area.</p>
            </div>

            <div className="flex gap-4 relative z-10 mt-8">
              <Link href="/matches">
                <Button size="lg" className="rounded-xl bg-white text-black hover:bg-white/90 font-bold px-8">Review Matches</Button>
              </Link>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-primary rounded-full blur-[120px] opacity-20" />
            <div className="absolute top-10 right-10 w-32 h-32 glass border-white/10 rounded-3xl flex items-center justify-center rotate-12">
              <Zap className="w-12 h-12 text-primary animate-pulse" />
            </div>
          </div>

          {/* User Stats Grid */}
          <div className="grid grid-cols-1 gap-6">
            <div className="glass rounded-[2rem] p-6 border-white/5 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground text-sm font-medium">Profile Completion</p>
                <span className="text-primary font-bold">85%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-primary" />
              </div>
            </div>

            <div className="glass rounded-[2rem] p-6 border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">42</p>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Total Likes</p>
              </div>
            </div>

            <div className="glass rounded-[2rem] p-6 border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">8.4</p>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Avg Compatibility</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3">
            <h3 className="font-headline text-2xl font-bold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                { type: 'match', name: 'Elena Vance', action: 'became a 94% match', time: '2 hours ago', icon: <Zap className="w-4 h-4 text-primary" /> },
                { type: 'like', name: 'Jordan Smith', action: 'liked your soul vector', time: '5 hours ago', icon: <Heart className="w-4 h-4 text-pink-500" /> },
                { type: 'msg', name: 'Sofia Rossi', action: 'sent you a message', time: 'Yesterday', icon: <MessageSquare className="w-4 h-4 text-secondary" /> },
              ].map((activity, idx) => (
                <div key={idx} className="glass p-4 rounded-2xl border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center relative">
                      <User className="w-6 h-6 text-muted-foreground" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full border border-white/10 flex items-center justify-center">
                        {activity.icon}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{activity.name} <span className="font-normal text-muted-foreground">{activity.action}</span></p>
                      <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-bold">{activity.time}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">View Details</Button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-headline text-2xl font-bold mb-6">Saved Matches</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass rounded-2xl overflow-hidden border-white/5 group">
                  <div className="relative aspect-square">
                    <Image 
                      src={`https://picsum.photos/seed/save${i}/300/300`} 
                      alt="Saved profile" 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <p className="text-xs font-bold text-white">Alex, 24</p>
                      <div className="flex items-center gap-1 text-[8px] text-white/70 uppercase tracking-tighter">
                        <Zap className="w-2 h-2 text-primary" /> 92% Match
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/saved" className="block mt-2">
                <Button variant="link" className="text-primary w-full justify-start p-0">View all saved matches</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
