
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
  Music, 
  User as UserIcon, 
  Brain, 
  Heart,
  Search,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { generateSoulVector } from "@/ai/flows/generate-soul-vector";

const STEPS = ["Basic", "Interests", "Personality", "Music", "Review"];

const INTEREST_OPTIONS = [
  "Sports", "Gaming", "Coding", "Books", "Movies", "Art", "Music", "Travel", 
  "Food", "Nature", "Fitness", "Photography", "Startups", "AI", "Philosophy"
];

export default function OnboardingPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
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

  const handleFinish = async () => {
    if (!user || !db) return;
    setLoading(true);
    
    try {
      // Generate Soul Vector essence via AI
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

      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        age: parseInt(formData.age),
        onboarded: true,
        soulVector: aiResult.soulVectorDescription,
        semanticExplanation: aiResult.semanticOverlapExplanation,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      router.push("/dashboard");
    } catch (e) {
      console.error(e);
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
          {loading ? "Generating Your Soul Vector" : "Checking Access..."}
        </h2>
        <p className="text-muted-foreground text-center max-w-sm">
          {loading 
            ? "Our AI is processing your personality and preferences to create your unique semantic embedding."
            : "Hang tight while we get things ready."}
        </p>
        <div className="mt-12 w-full max-w-xs h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3 }}
            className="h-full bg-primary"
          />
        </div>
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
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-headline font-bold mb-2">The Basics</h2>
                  <p className="text-muted-foreground">Let's start with who you are.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</label>
                    <Input placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 bg-white/5 border-white/10 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Age</label>
                    <Input placeholder="24" type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="h-12 bg-white/5 border-white/10 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">City</label>
                  <Input placeholder="San Francisco, CA" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="h-12 bg-white/5 border-white/10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bio</label>
                  <Textarea 
                    placeholder="Tell us a bit about your worldview..." 
                    className="min-h-[120px] bg-white/5 border-white/10 rounded-xl" 
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                  />
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-headline font-bold mb-2">Your Interests</h2>
                  <p className="text-muted-foreground">What makes you tick? Select at least 3.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {INTEREST_OPTIONS.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-6 py-3 rounded-full text-sm font-medium border transition-all ${
                        formData.interests.includes(interest)
                          ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                          : 'border-white/10 bg-white/5 text-muted-foreground hover:border-white/20'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-headline font-bold mb-2">Personality</h2>
                  <p className="text-muted-foreground">Where do you fall on these spectrums?</p>
                </div>
                <div className="grid gap-4">
                  <PersonalitySlider 
                    labelLeft="Introvert" 
                    labelRight="Extrovert" 
                    value={formData.personality.introvertExtrovert}
                    onChange={v => setFormData({ ...formData, personality: { ...formData.personality, introvertExtrovert: v } })}
                    description="Social Battery"
                  />
                  <PersonalitySlider 
                    labelLeft="Creative" 
                    labelRight="Analytical" 
                    value={formData.personality.creativeAnalytical}
                    onChange={v => setFormData({ ...formData, personality: { ...formData.personality, creativeAnalytical: v } })}
                    description="Thought Process"
                  />
                  <PersonalitySlider 
                    labelLeft="Planner" 
                    labelRight="Spontaneous" 
                    value={formData.personality.plannerSpontaneous}
                    onChange={v => setFormData({ ...formData, personality: { ...formData.personality, plannerSpontaneous: v } })}
                    description="Daily Life"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-headline font-bold mb-2">Music Taste</h2>
                  <p className="text-muted-foreground">The ultimate soul filter.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Favorite Genres (comma separated)</label>
                    <Input 
                      placeholder="Electronic, Jazz, Hip Hop..." 
                      className="h-12 bg-white/5 border-white/10 rounded-xl"
                      value={formData.music.genres.join(", ")}
                      onChange={e => setFormData({...formData, music: {...formData.music, genres: e.target.value.split(",").map(s => s.trim())}})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Favorite Artists (comma separated)</label>
                    <Input 
                      placeholder="Aphex Twin, Radiohead..." 
                      className="h-12 bg-white/5 border-white/10 rounded-xl"
                      value={formData.music.artists.join(", ")}
                      onChange={e => setFormData({...formData, music: {...formData.music, artists: e.target.value.split(",").map(s => s.trim())}})}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-headline font-bold mb-2">Review Profile</h2>
                  <p className="text-muted-foreground">Everything look good? Let's launch your soul vector.</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                      <UserIcon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-2xl">{formData.name || "User"}, {formData.age || "??"}</h3>
                      <p className="text-muted-foreground">{formData.city || "Earth"}</p>
                    </div>
                  </div>

                  <div className="glass p-6 rounded-2xl border-white/5">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map(i => <Badge key={i} className="bg-primary/20 border-primary/20 text-primary">{i}</Badge>)}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex justify-between gap-4">
            <Button variant="ghost" onClick={prevStep} disabled={step === 0} className="rounded-xl px-8 h-12">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            
            {step === STEPS.length - 1 ? (
              <Button onClick={handleFinish} className="rounded-xl px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Generate Soul Vector
              </Button>
            ) : (
              <Button onClick={nextStep} className="rounded-xl px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
