
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PersonalitySlider } from "@/components/ui/personality-slider";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  User as UserIcon, 
  CheckCircle2,
  Loader2,
  Music as MusicIcon
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { useUser, mockDb } from "@/firebase";
import { useRouter } from "next/navigation";
import { generateSoulVector } from "@/ai/flows/generate-soul-vector";
import { useToast } from "@/hooks/use-toast";

const STEPS = ["Basic", "Interests", "Personality", "Spotify", "Review"];

const INTEREST_OPTIONS = [
  "Sports", "Gaming", "Coding", "Books", "Movies", "Art", "Music", "Travel", 
  "Food", "Nature", "Fitness", "Photography", "Startups", "AI", "Philosophy"
];

export default function OnboardingPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    city: "",
    bio: "",
    interests: [] as string[],
    personality: {
      introvertExtrovert: 50,
      creativeAnalytical: 50,
      plannerSpontaneous: 50,
      logicalEmotional: 50,
      adventurousCareful: 50,
    },
    music: {
      genres: [] as string[],
      artists: [] as string[],
    }
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleConnectSpotify = () => {
    setLoading(true);
    // Simulate Spotify OAuth flow
    setTimeout(() => {
      setSpotifyConnected(true);
      setFormData(prev => ({
        ...prev,
        music: {
          genres: ["Techno", "Ambient", "Jazz Fusion"],
          artists: ["Floating Points", "Aphex Twin", "John Coltrane"]
        }
      }));
      setLoading(false);
      toast({
        title: "Spotify Connected",
        description: "Your music profile has been enriched with your top artists and genres.",
      });
    }, 1500);
  };

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const aiResult = await generateSoulVector({
        name: formData.name,
        age: parseInt(formData.age),
        city: formData.city,
        bio: formData.bio,
        interests: formData.interests,
        personalityTraits: {
          introvertExtrovert: formData.personality.introvertExtrovert / 10,
          creativeAnalytical: formData.personality.creativeAnalytical / 10,
          plannerSpontaneous: formData.personality.plannerSpontaneous / 10,
          logicalEmotional: formData.personality.logicalEmotional / 10,
          adventurousCareful: formData.personality.adventurousCareful / 10,
        },
        musicProfile: {
          genres: formData.music.genres,
          favoriteArtists: formData.music.artists,
        }
      });

      mockDb.set("users", user.uid, {
        ...formData,
        age: parseInt(formData.age),
        onboarded: true,
        spotifyConnected,
        soulVector: aiResult.soulVectorDescription,
        semanticExplanation: aiResult.semanticOverlapExplanation,
        updatedAt: new Date().toISOString()
      });

      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      mockDb.set("users", user.uid, {
        ...formData,
        onboarded: true,
        spotifyConnected,
        soulVector: "A complex harmonic intelligence seeking resonant frequencies.",
        semanticExplanation: "AI simulation processed your profile essence locally."
      });
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (loading && step === STEPS.length - 1)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-8"
        >
          <Sparkles className="w-16 h-16 text-primary" />
        </motion.div>
        <h2 className="text-3xl font-headline font-bold mb-4 text-center">
          {loading ? "Syncing Your Soul Vector" : "Checking Access..."}
        </h2>
        <p className="text-muted-foreground text-center max-w-sm">
          Processing your profile and music tastes to create your unique semantic identity.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-32">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          {STEPS.map((s, idx) => (
            <div key={s} className="flex flex-col items-center gap-2 flex-1 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                idx <= step ? 'bg-primary border-primary text-primary-foreground' : 'border-white/10 text-muted-foreground'
              }`}>
                {idx < step ? <CheckCircle2 className="w-6 h-6" /> : <span>{idx + 1}</span>}
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-widest ${
                idx <= step ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {s}
              </span>
              {idx < STEPS.length - 1 && (
                <div className={`absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-[2px] ${
                  idx < step ? 'bg-primary' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="glass p-8 md:p-12 rounded-[2.5rem] border-white/10 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" className="space-y-6">
                <h2 className="text-3xl font-headline font-bold mb-2">The Basics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 bg-white/5 border-white/10" />
                  <Input placeholder="Age" type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="h-12 bg-white/5 border-white/10" />
                </div>
                <Input placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="h-12 bg-white/5 border-white/10" />
                <Textarea placeholder="Bio" className="min-h-[120px] bg-white/5 border-white/10" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" className="space-y-6">
                <h2 className="text-3xl font-headline font-bold mb-2">Your Interests</h2>
                <div className="flex flex-wrap gap-3">
                  {INTEREST_OPTIONS.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-6 py-3 rounded-full text-sm border transition-all ${
                        formData.interests.includes(interest) ? 'bg-primary text-primary-foreground' : 'border-white/10 bg-white/5 text-muted-foreground'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" className="space-y-6">
                <h2 className="text-3xl font-headline font-bold mb-2">Personality</h2>
                <PersonalitySlider labelLeft="Introvert" labelRight="Extrovert" value={formData.personality.introvertExtrovert} onChange={v => setFormData({ ...formData, personality: { ...formData.personality, introvertExtrovert: v } })} />
                <PersonalitySlider labelLeft="Creative" labelRight="Analytical" value={formData.personality.creativeAnalytical} onChange={v => setFormData({ ...formData, personality: { ...formData.personality, creativeAnalytical: v } })} />
                <PersonalitySlider labelLeft="Planner" labelRight="Spontaneous" value={formData.personality.plannerSpontaneous} onChange={v => setFormData({ ...formData, personality: { ...formData.personality, plannerSpontaneous: v } })} />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" className="space-y-8 text-center py-10">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-[#1DB954]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <MusicIcon className="w-8 h-8 text-[#1DB954]" />
                  </div>
                  <h2 className="text-3xl font-headline font-bold mb-4">Music Profile</h2>
                  <p className="text-muted-foreground mb-8">
                    Connect your Spotify to automatically enrich your Soul Vector with your favorite artists and listening habits.
                  </p>
                  
                  {spotifyConnected ? (
                    <div className="glass bg-[#1DB954]/5 border-[#1DB954]/20 p-6 rounded-2xl text-left">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-[#1DB954]" />
                        <span className="font-bold text-[#1DB954]">Spotify Account Synced</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Top Genres</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.music.genres.map(g => <Badge key={g} variant="outline" className="border-white/10">{g}</Badge>)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleConnectSpotify} 
                      className="w-full h-14 rounded-2xl bg-[#1DB954] hover:bg-[#1DB954]/90 text-white font-bold gap-3"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <MusicIcon className="w-5 h-5" />}
                      Connect Spotify
                    </Button>
                  )}
                  
                  <button onClick={nextStep} className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors underline">
                    I'll add music manually later
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" className="space-y-8 text-center">
                <h2 className="text-3xl font-headline font-bold mb-2">Almost Ready!</h2>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center"><UserIcon className="w-8 h-8 text-primary" /></div>
                  <h3 className="text-2xl font-headline font-bold">{formData.name || "User"}, {formData.age || "??"}</h3>
                  <div className="flex gap-2">
                    {spotifyConnected && <Badge className="bg-[#1DB954]/20 text-[#1DB954] border-none">Spotify Linked</Badge>}
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-none">Onboarding Complete</Badge>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex justify-between gap-4">
            <Button variant="ghost" onClick={prevStep} disabled={step === 0} className="rounded-xl px-8 h-12">Back</Button>
            {step === STEPS.length - 1 ? (
              <Button onClick={handleFinish} className="rounded-xl px-8 h-12 bg-primary" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />} Finalize Vector
              </Button>
            ) : step !== 3 ? (
              <Button onClick={nextStep} className="rounded-xl px-8 h-12 bg-primary">Continue <ArrowRight className="ml-2" /></Button>
            ) : (
               <Button onClick={nextStep} variant="ghost" className="rounded-xl px-8 h-12">Skip</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
