"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { ArrowRight, BrainCircuit, Music, Heart, Zap, Sparkles as SparklesIcon, Globe, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/firebase";

export default function LandingPage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-10"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>High-Dimensional Matchmaking</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="font-headline text-6xl md:text-9xl font-bold tracking-tighter mb-10 leading-[0.85] md:leading-[0.85]"
          >
            Connect Beyond <br />
            <span className="text-gradient">The Surface</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-xl md:text-2xl max-w-3xl mx-auto mb-16 leading-relaxed font-medium opacity-80"
          >
            Soulmatter uses high-dimensional vector embeddings to find people who resonate with your personality, values, and musical soul.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href={user ? "/dashboard" : "/signup"}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-12 py-8 text-xl group shadow-2xl shadow-primary/30 font-bold">
                {user ? "Go to Dashboard" : "Create Your Vector"}
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/matches">
              <Button size="lg" variant="outline" className="rounded-2xl px-12 py-8 text-xl glass border-white/10 hover:bg-white/5 font-bold">
                Browse Discovery
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[800px] pointer-events-none opacity-40">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-secondary/20 rounded-full blur-[160px] animate-pulse-slow delay-1000" />
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 px-4 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6">Designed for Depth</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We've replaced the swipe with semantic resonance, mapping your identity across 512 cognitive dimensions.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: BrainCircuit,
                title: "Semantic Intelligence",
                desc: "Our neural system understands the nuance of your bio and interests, mapping you in 512 dimensions for perfect resonance.",
                color: "primary"
              },
              {
                icon: Music,
                title: "Musical Synergy",
                desc: "Sync your Spotify or manual favorites. We match you with those whose musical soul vibrates at your frequency.",
                color: "secondary"
              },
              {
                icon: ShieldCheck,
                title: "Safe Connection",
                desc: "No more small talk. Our match explanations give you the 'why' before you even send your first message.",
                color: "pink-500"
              }
            ].map((f, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="glass p-12 rounded-[3.5rem] border-white/5 flex flex-col items-start group relative overflow-hidden"
              >
                <div className={`w-16 h-16 bg-${f.color}/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-8 h-8 text-${f.color}`} />
                </div>
                <h3 className="font-headline font-bold text-2xl mb-4">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium opacity-70">{f.desc}</p>
                <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-${f.color}/5 rounded-full blur-3xl`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-32 px-4 bg-black/20 border-y border-white/5 relative">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="font-headline text-5xl md:text-6xl font-bold mb-20 tracking-tight">The Future of Discovery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { label: "Stability Rate", value: "98.2%", sub: "Vector alignment" },
              { label: "Matches Active", value: "1.2M+", sub: "Global resonance" },
              { label: "Dimensions", value: "512", sub: "Semantic resolution" }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-6xl md:text-7xl font-headline font-bold text-gradient mb-3">{stat.value}</div>
                <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-1">{stat.label}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-50">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      </section>

      {/* Final CTA */}
      <section className="py-40 px-4">
        <div className="max-w-4xl mx-auto text-center glass p-16 md:p-24 rounded-[4rem] border-white/10 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-headline font-bold mb-8">Ready to sync?</h2>
            <p className="text-muted-foreground text-xl mb-12 max-w-xl mx-auto">Join the high-dimensional network and find your resonant frequency.</p>
            <Link href={user ? "/dashboard" : "/signup"}>
              <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-2xl px-12 py-8 text-xl font-bold shadow-2xl">
                Initialize Your Vector
              </Button>
            </Link>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Globe className="w-64 h-64" />
          </div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
