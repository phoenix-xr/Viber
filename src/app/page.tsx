
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { ArrowRight, BrainCircuit, Music, Heart, Zap, Sparkles as SparklesIcon } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/firebase";

export default function LandingPage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>Next-Gen Semantic Matchmaking</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="font-headline text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[0.9]"
          >
            Connect Beyond <br />
            <span className="text-gradient">The Surface</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
          >
            Soulmatter uses high-dimensional AI vector embeddings to find people who resonate with your personality, values, and musical soul.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href={user ? "/dashboard" : "/signup"}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-10 py-8 text-xl group shadow-2xl shadow-primary/30 font-bold">
                {user ? "Go to Dashboard" : "Create Your Vector"}
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/matches">
              <Button size="lg" variant="outline" className="rounded-2xl px-10 py-8 text-xl glass border-white/10 hover:bg-white/5 font-bold">
                Browse Discovery
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[800px] pointer-events-none opacity-40">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[150px] animate-pulse-slow delay-1000" />
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="glass p-10 rounded-[2.5rem] border-white/5 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <BrainCircuit className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-headline font-bold text-2xl mb-4">Semantic Intelligence</h3>
              <p className="text-muted-foreground">Our AI understands the nuance of your bio and interests, mapping you in 512 dimensions for perfect resonance.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="glass p-10 rounded-[2.5rem] border-white/5 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                <Music className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-headline font-bold text-2xl mb-4">Musical Synergy</h3>
              <p className="text-muted-foreground">Sync your Spotify or manual favorites. We match you with those whose musical soul vibrates at your frequency.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="glass p-10 rounded-[2.5rem] border-white/5 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-500/20 transition-colors">
                <Heart className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="font-headline font-bold text-2xl mb-4">Deep Connection</h3>
              <p className="text-muted-foreground">No more small talk. Our AI match explanations give you the "why" before you even send your first message.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 px-4 bg-black/10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-16">The Future of Discovery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { label: "Stability Rate", value: "98.2%" },
              { label: "Matches Active", value: "1.2M+" },
              { label: "Vector Dimensions", value: "512" }
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-5xl font-headline font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
