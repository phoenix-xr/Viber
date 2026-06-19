"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { ArrowRight, BrainCircuit, Music, UserCheck, Zap, Heart, Globe, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>Next-Gen Semantic Matchmaking is here</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-headline text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
          >
            Find Your People <br />
            <span className="text-gradient">Through AI Intelligence</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Move beyond swiping. Soulmatter uses high-dimensional vector embeddings to match you based on deep personality traits, shared values, and musical soul.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/onboarding">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg group shadow-xl shadow-primary/20">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/matches">
              <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg glass border-white/10 hover:bg-white/5">
                View Demo
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Animated Background Visualization */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[600px] pointer-events-none opacity-30">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary rounded-full blur-[80px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-secondary rounded-full blur-[100px] animate-pulse-slow delay-1000" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto glass rounded-3xl p-8 md:p-12 border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-headline font-bold mb-2">50k+</h3>
            <p className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Matches Generated</p>
          </div>
          <div className="border-x border-white/10">
            <h3 className="text-4xl font-headline font-bold mb-2">12M+</h3>
            <p className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">User Profiles</p>
          </div>
          <div>
            <h3 className="text-4xl font-headline font-bold mb-2">800k</h3>
            <p className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Embeddings Processed</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl md:text-5xl font-bold mb-4">Science-First Matching</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">No more swiping fatigue. We focus on the data that actually creates lasting connections.</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: <BrainCircuit className="w-6 h-6 text-primary" />, title: "Semantic Matching", desc: "Using advanced NLP to understand your bio and interests beyond keywords." },
              { icon: <UserCheck className="w-6 h-6 text-secondary" />, title: "Personality Analysis", desc: "Interactive mapping of traits to identify compatible personality types." },
              { icon: <Music className="w-6 h-6 text-pink-500" />, title: "Spotify Integration", desc: "Sync your listening habits to find your literal music soulmate." },
              { icon: <Lock className="w-6 h-6 text-cyan-400" />, title: "Privacy First", desc: "Your vector embeddings are secure. We only share what's necessary for matching." },
            ].map((feature, idx) => (
              <motion.div key={idx} variants={itemVariants} className="glass p-8 rounded-2xl border-white/5 hover:border-primary/50 transition-colors group">
                <div className="mb-6 bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-headline font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="font-headline text-3xl md:text-5xl font-bold mb-8">Four steps to <span className="text-primary">true connection</span>.</h2>
              <div className="space-y-8">
                {[
                  { step: "01", title: "Build Your Profile", desc: "Tell us about your world. Not just what you do, but how you think." },
                  { step: "02", title: "Connect Your Soul", desc: "Sync Spotify and share your favorite interests for a complete picture." },
                  { step: "03", title: "Generate Soul Vector", desc: "Our AI processes your profile into a unique high-dimensional vector." },
                  { step: "04", title: "Discover Real Matches", desc: "Browse people who don't just look good, but actually match your essence." },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-start">
                    <span className="text-primary font-headline font-bold text-2xl opacity-50">{item.step}</span>
                    <div>
                      <h4 className="font-headline font-bold text-xl mb-1">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative z-10 glass p-4 rounded-3xl border-white/10 shadow-2xl rotate-3 translate-x-4">
                <Image
                  src="https://picsum.photos/seed/soulmatter-app/800/1000"
                  alt="App Interface"
                  width={400}
                  height={500}
                  className="rounded-2xl"
                  data-ai-hint="mobile app"
                />
              </div>
              <div className="absolute top-0 right-0 glass p-4 rounded-3xl border-white/10 shadow-2xl -rotate-6 -translate-x-12 translate-y-20 z-0">
                <div className="w-[300px] h-[400px] bg-muted/50 rounded-xl flex flex-col p-6 gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full" />
                  <div className="w-full h-4 bg-white/10 rounded" />
                  <div className="w-2/3 h-4 bg-white/10 rounded" />
                  <div className="mt-auto flex justify-between">
                    <div className="w-24 h-8 bg-primary/40 rounded-full" />
                    <div className="w-8 h-8 bg-secondary/40 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/5 p-12 md:p-24 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-headline text-4xl md:text-6xl font-bold mb-6">Ready to find <br /> your soulmate?</h2>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto">Join the vector-powered revolution and experience dating that actually makes sense.</p>
            <Link href="/onboarding">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-12 py-6 text-lg font-bold">
                Start My Journey
              </Button>
            </Link>
          </div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary rounded-full blur-[100px] opacity-20" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
