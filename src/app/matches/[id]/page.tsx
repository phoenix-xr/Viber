
"use client";

import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { CompatibilityRing } from "@/components/ui/compatibility-ring";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Heart, X, MessageSquare, MapPin, Sparkles, Brain, Music, UserCheck, Share2, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser, useDoc, mockDb } from "@/firebase";
import { useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function MatchDetailPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const { data: match, loading: matchLoading } = useDoc(id ? { collection: 'users', id: id as string } : null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleAction = (type: 'like' | 'pass' | 'save') => {
    if (!user || !id) return;
    
    mockDb.add("interactions", {
      type,
      userId: user.uid,
      targetUserId: id as string,
      timestamp: new Date().toISOString()
    });

    toast({
      title: type.charAt(0).toUpperCase() + type.slice(1) + "d!",
      description: `You ${type}d ${match?.name || 'this user'}.`,
    });

    if (type === 'pass' || type === 'like') {
      router.push('/matches');
    }
  };

  const startChat = () => {
    if (!id || !user) return;
    const chatId = [user.uid, id].sort().join("_");
    router.push(`/chats/${chatId}`);
  };

  if (authLoading || matchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
        <Link href="/matches"><Button>Back to Discovery</Button></Link>
      </div>
    );
  }

  const compatibilityScore = match.compatibilityScore || 92;

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-32 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden glass border-white/10 shadow-2xl">
              <Image 
                src={`https://picsum.photos/seed/${id}/800/1000`} 
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
                <CompatibilityRing score={compatibilityScore} size={80} strokeWidth={8} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => handleAction('pass')} size="lg" variant="outline" className="rounded-2xl h-16 glass border-white/10 text-xl font-bold">
                <X className="w-6 h-6 mr-2 text-muted-foreground" /> Pass
              </Button>
              <Button onClick={() => handleAction('like')} size="lg" className="rounded-2xl h-16 bg-primary hover:bg-primary/90 text-primary-foreground text-xl font-bold shadow-xl shadow-primary/20">
                <Heart className="w-6 h-6 mr-2 fill-current" /> Match
              </Button>
            </div>
            
            <Button onClick={startChat} size="lg" variant="outline" className="w-full rounded-2xl h-14 glass border-white/10 gap-2">
              <MessageSquare className="w-5 h-5 text-secondary" /> Message
            </Button>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <section className="glass p-8 rounded-[2.5rem] border-white/5">
              <h2 className="font-headline text-2xl font-bold mb-4">About {match.name}</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {match.bio}
              </p>
            </section>

            <section className="glass p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Compatibility Report</span>
                </div>
                <h3 className="text-3xl font-headline font-bold mb-4">Why You Matched</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {match.semanticExplanation || "Your Soul Vectors show a significant semantic overlap in Analytical Thought and Musical Complexity."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass bg-white/5 p-4 rounded-2xl border-white/5">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Common Ground</h4>
                    <div className="flex flex-wrap gap-2">
                      {match.interests?.slice(0, 5).map((i: string) => (
                        <Badge key={i} className="bg-secondary/20 text-secondary border-none">{i}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="glass bg-white/5 p-4 rounded-2xl border-white/5">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Soul Essence</h4>
                    <p className="text-xs text-muted-foreground italic line-clamp-3">"{match.soulVector}"</p>
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
                    { label: "Introvert / Extrovert", value: (match.personalityTraits?.introvertExtrovert || 5) * 10 },
                    { label: "Creative / Analytical", value: (match.personalityTraits?.creativeAnalytical || 5) * 10 },
                    { label: "Planner / Spontaneous", value: (match.personalityTraits?.plannerSpontaneous || 5) * 10 },
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
                      {match.musicProfile?.genres?.map((g: string) => <Badge key={g} variant="outline" className="border-white/10 text-white/70">{g}</Badge>)}
                      {match.music?.genres?.map((g: string) => <Badge key={g} variant="outline" className="border-white/10 text-white/70">{g}</Badge>)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Favorite Artists</h4>
                    <div className="flex flex-wrap gap-2">
                      {match.musicProfile?.favoriteArtists?.map((a: string) => <Badge key={a} variant="outline" className="border-white/10 text-white/70">{a}</Badge>)}
                      {match.music?.artists?.map((a: string) => <Badge key={a} variant="outline" className="border-white/10 text-white/70">{a}</Badge>)}
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
