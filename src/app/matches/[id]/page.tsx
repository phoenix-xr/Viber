"use client";

import { useParams } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { CompatibilityRing } from "@/components/ui/compatibility-ring";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Heart, X, MessageSquare, MapPin, Sparkles, Brain, Music, UserCheck, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MatchDetailPage() {
  const params = useParams();

  // In a real app, fetch match by id
  const match = {
    id: params.id,
    name: "Alex Rivers",
    age: 26,
    city: "San Francisco, CA",
    compatibilityScore: 92,
    bio: "Passionate about minimalism, jazz fusion, and high-performance computing. Looking for someone who enjoys late-night deep conversations and exploring brutalist architecture.",
    interests: ["Coding", "Jazz", "Philosophy", "Photography", "Brutalism", "AI Art"],
    personality: {
      introvertExtrovert: 30,
      creativeAnalytical: 15,
      plannerSpontaneous: 80,
    },
    music: {
      artists: ["Kamasi Washington", "Aphex Twin", "Miles Davis"],
      genres: ["Jazz Fusion", "IDM", "Hard Bop"]
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-32 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Media & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden glass border-white/10 shadow-2xl">
              <Image 
                src="https://picsum.photos/seed/soul1/800/1000" 
                alt={match.name} 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                <div>
                  <h1 className="font-headline text-4xl font-bold text-white mb-2">{match.name}, {match.age}</h1>
                  <div className="flex items-center gap-2 text-white/70">
                    <MapPin className="w-4 h-4" />
                    {match.city}
                  </div>
                </div>
                <CompatibilityRing score={match.compatibilityScore} size={80} strokeWidth={8} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button size="lg" variant="outline" className="rounded-2xl h-16 glass border-white/10 text-xl font-bold">
                <X className="w-6 h-6 mr-2 text-muted-foreground" /> Pass
              </Button>
              <Button size="lg" className="rounded-2xl h-16 bg-primary hover:bg-primary/90 text-primary-foreground text-xl font-bold shadow-xl shadow-primary/20">
                <Heart className="w-6 h-6 mr-2 fill-current" /> Match
              </Button>
            </div>
            
            <Button size="lg" variant="outline" className="w-full rounded-2xl h-14 glass border-white/10 gap-2">
              <MessageSquare className="w-5 h-5 text-secondary" /> Message
            </Button>
          </div>

          {/* Right Column: Deep Insights */}
          <div className="lg:col-span-7 space-y-8">
            <section className="glass p-8 rounded-[2.5rem] border-white/5">
              <h2 className="font-headline text-2xl font-bold mb-4">About Alex</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {match.bio}
              </p>
            </section>

            {/* AI Explanation Card */}
            <section className="glass p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Compatibility Report</span>
                </div>
                <h3 className="text-3xl font-headline font-bold mb-4">Why You Matched</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Your Soul Vectors show a significant semantic overlap in <span className="text-foreground font-bold">Analytical Thought</span> and <span className="text-foreground font-bold">Musical Complexity</span>. Both profiles indicate a preference for creative problem-solving and shared interests in high-fidelity soundscapes.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass bg-white/5 p-4 rounded-2xl border-white/5">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Common Ground</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-secondary/20 text-secondary border-none">Coding</Badge>
                      <Badge className="bg-secondary/20 text-secondary border-none">Jazz</Badge>
                      <Badge className="bg-secondary/20 text-secondary border-none">Photography</Badge>
                    </div>
                  </div>
                  <div className="glass bg-white/5 p-4 rounded-2xl border-white/5">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Soul Harmony</h4>
                    <p className="text-xs text-muted-foreground">Alex's introvert nature complements your social energy, creating a balanced dynamic.</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-[60px]" />
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="glass p-8 rounded-[2.5rem] border-white/5">
                <h3 className="font-headline text-xl font-bold mb-6 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Personality
                </h3>
                <div className="space-y-6">
                  {[
                    { label: "Introvert", value: 30 },
                    { label: "Creative", value: 15 },
                    { label: "Spontaneous", value: 80 },
                  ].map((trait, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                        <span>{trait.label}</span>
                        <span>{trait.value}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${trait.value}%` }}
                          className="h-full bg-primary" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="glass p-8 rounded-[2.5rem] border-white/5">
                <h3 className="font-headline text-xl font-bold mb-6 flex items-center gap-2">
                  <Music className="w-5 h-5 text-secondary" />
                  Music Profile
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Top Genres</h4>
                    <div className="flex flex-wrap gap-2">
                      {match.music.genres.map(g => <Badge key={g} variant="outline" className="border-white/10 text-white/70">{g}</Badge>)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Favorite Artists</h4>
                    <div className="flex flex-wrap gap-2">
                      {match.music.artists.map(a => <Badge key={a} variant="outline" className="border-white/10 text-white/70">{a}</Badge>)}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
