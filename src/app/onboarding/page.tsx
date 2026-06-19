"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
  Music as MusicIcon,
  Plus,
  X,
  Brain,
  Tag,
  Mic2,
  Camera,
  AlertCircle
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { useUser, useDoc, mockDb } from "@/firebase";
import { useRouter } from "next/navigation";
import { generateSoulVector } from "@/ai/flows/generate-soul-vector";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const STEPS = ["Basic", "Interests", "Personality", "Music", "Review"];

const INTEREST_OPTIONS = [
  "Sports", "Gaming", "Coding", "Books", "Movies", "Art", "Music", "Travel", 
  "Food", "Nature", "Fitness", "Photography", "Startups", "Computing", "Philosophy"
];

export default function OnboardingPage() {
  const { user, loading: authLoading, logout } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [showManualMusic, setShowManualMusic] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    city: "",
    bio: "",
    profileImage: "",
    interests: [] as string[],
    customPersonalityTraits: [] as string[],
    personality: {
      introvertExtrovert: 50,
      creativeAnalytical: 50,
      plannerSpontaneous: 50,
      logicalEmotional: 50,
      adventurousCareful: 50,
    },
    music: {
      genres: [] as string[],
      favoriteArtists: [] as string[],
    }
  });

  const [newInterest, setNewInterest] = useState("");
  const [newTrait, setNewTrait] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [newArtist, setNewArtist] = useState("");

  const profileQuery = useMemo(() => 
    user ? { collection: 'users', id: user.uid } : null
  , [user?.uid]);

  const { data: profile, loading: profileLoading } = useDoc(profileQuery);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        age: profile.age?.toString() || "",
        city: profile.city || "",
        bio: profile.bio || "",
        profileImage: profile.profileImage || "",
        interests: profile.interests || [],
        customPersonalityTraits: profile.customPersonalityTraits || [],
        personality: profile.personality || {
          introvertExtrovert: 50,
          creativeAnalytical: 50,
          plannerSpontaneous: 50,
          logicalEmotional: 50,
          adventurousCareful: 50,
        },
        music: profile.music || {
          genres: [],
          favoriteArtists: [],
        }
      });
      if (profile.spotifyConnected) setSpotifyConnected(true);
    }
  }, [profile]);

  const nextStep = () => {
    if (step === 0) {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 18) {
        setAgeError(true);
        return;
      }
      setAgeError(false);
    }
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };
  
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const addCustomInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const addCustomTrait = () => {
    if (newTrait.trim() && !formData.customPersonalityTraits.includes(newTrait.trim())) {
      setFormData(prev => ({
        ...prev,
        customPersonalityTraits: [...prev.customPersonalityTraits, newTrait.trim()]
      }));
      setNewTrait("");
    }
  };

  const removeTrait = (trait: string) => {
    setFormData(prev => ({
      ...prev,
      customPersonalityTraits: prev.customPersonalityTraits.filter(t => t !== trait)
    }));
  };

  const handleConnectSpotify = () => {
    setLoading(true);
    setTimeout(() => {
      setSpotifyConnected(true);
      setShowManualMusic(false);
      setFormData(prev => ({
        ...prev,
        music: {
          genres: ["Techno", "Ambient", "Jazz Fusion"],
          favoriteArtists: ["Floating Points", "Aphex Twin", "John Coltrane"]
        }
      }));
      setLoading(false);
      toast({
        title: "Spotify Connected",
        description: "Your music profile has been enriched.",
      });
      nextStep();
    }, 1500);
  };

  const addManualGenre = () => {
    if (newGenre.trim() && !formData.music.genres.includes(newGenre.trim())) {
      setFormData(prev => ({
        ...prev,
        music: { ...prev.music, genres: [...prev.music.genres, newGenre.trim()] }
      }));
      setNewGenre("");
    }
  };

  const addManualArtist = () => {
    if (newArtist.trim() && !formData.music.favoriteArtists.includes(newArtist.trim())) {
      setFormData(prev => ({
        ...prev,
        music: { ...prev.music, favoriteArtists: [...prev.music.favoriteArtists, newArtist.trim()] }
      }));
      setNewArtist("");
    }
  };

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const result = await generateSoulVector({
        name: formData.name,
        age: parseInt(formData.age) || 0,
        city: formData.city,
        bio: formData.bio,
        interests: formData.interests,
        customPersonalityTraits: formData.customPersonalityTraits,
        personalityTraits: {
          introvertExtrovert: formData.personality.introvertExtrovert / 10,
          creativeAnalytical: formData.personality.creativeAnalytical / 10,
          plannerSpontaneous: formData.personality.plannerSpontaneous / 10,
          logicalEmotional: formData.personality.logicalEmotional / 10,
          adventurousCareful: formData.personality.adventurousCareful / 10,
        },
        musicProfile: {
          genres: formData.music.genres,
          favoriteArtists: formData.music.favoriteArtists,
        }
      });

      mockDb.set("users", user.uid, {
        ...formData,
        age: parseInt(formData.age) || 0,
        onboarded: true,
        spotifyConnected,
        soulVector: result.soulVectorDescription,
        semanticExplanation: result.semanticOverlapExplanation,
        updatedAt: new Date().toISOString()
      });

      toast({
        title: profile?.onboarded ? "Vector Updated" : "Vector Finalized",
        description: "Your Soul Identity has been synced.",
      });

      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      mockDb.set("users", user.uid, {
        ...formData,
        onboarded: true,
        spotifyConnected,
        soulVector: "A complex harmonic intelligence seeking resonance.",
        semanticExplanation: "System processed your profile locally."
      });
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (profileLoading && !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (ageError && step === 0 && formData.age && parseInt(formData.age) < 18) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32 px-4">
        <Navbar />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full glass p-10 rounded-[2.5rem] border-white/10 text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
          <h2 className="text-3xl font-headline font-bold mb-4 text-destructive">Not Eligible</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            We're sorry, but you must be at least 18 years old to use Soulmatter.
          </p>
          <Button onClick={() => logout()} className="w-full h-12 rounded-xl bg-primary">
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-32">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          {STEPS.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 flex-1 relative">
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
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="flex flex-col items-center mb-8">
                   <div 
                    className="w-32 h-32 rounded-3xl bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-all relative overflow-hidden group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {formData.profileImage ? (
                      <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                        <span className="text-[10px] uppercase font-bold text-muted-foreground group-hover:text-primary">Photo</span>
                      </>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  <p className="mt-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Profile Image</p>
                </div>

                <h2 className="text-3xl font-headline font-bold mb-2">The Basics</h2>
                
                {ageError && (
                  <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 rounded-2xl">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Eligibility Requirement</AlertTitle>
                    <AlertDescription>
                      You must be at least 18 years old to join Soulmatter.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 bg-white/5 border-white/10" />
                  <Input 
                    placeholder="Age" 
                    type="number" 
                    value={formData.age} 
                    onChange={e => {
                      setFormData({...formData, age: e.target.value});
                      if (parseInt(e.target.value) >= 18) setAgeError(false);
                    }} 
                    className={`h-12 bg-white/5 border-white/10 ${ageError ? 'border-destructive' : ''}`} 
                  />
                </div>
                <Input placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="h-12 bg-white/5 border-white/10" />
                <Textarea placeholder="Bio - What makes you, you?" className="min-h-[120px] bg-white/5 border-white/10" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
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
                
                <div className="pt-6 border-t border-white/5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-4">Add Custom Interest</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="Type an interest..." 
                        value={newInterest} 
                        onChange={e => setNewInterest(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addCustomInterest()}
                        className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl"
                      />
                    </div>
                    <Button size="icon" onClick={addCustomInterest} className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10">
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-3xl font-headline font-bold mb-2">Personality</h2>
                <div className="grid grid-cols-1 gap-4">
                  <PersonalitySlider labelLeft="Introvert" labelRight="Extrovert" value={formData.personality.introvertExtrovert} onChange={v => setFormData({ ...formData, personality: { ...formData.personality, introvertExtrovert: v } })} />
                  <PersonalitySlider labelLeft="Creative" labelRight="Analytical" value={formData.personality.creativeAnalytical} onChange={v => setFormData({ ...formData, personality: { ...formData.personality, creativeAnalytical: v } })} />
                  <PersonalitySlider labelLeft="Planner" labelRight="Spontaneous" value={formData.personality.plannerSpontaneous} onChange={v => setFormData({ ...formData, personality: { ...formData.personality, plannerSpontaneous: v } })} />
                </div>

                <div className="pt-6 border-t border-white/5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-4">Specific Traits</label>
                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <Brain className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="e.g. Stoic, Empathetic..." 
                        value={newTrait} 
                        onChange={e => setNewTrait(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addCustomTrait()}
                        className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl"
                      />
                    </div>
                    <Button size="icon" onClick={addCustomTrait} className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10">
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.customPersonalityTraits.map(trait => (
                      <Badge key={trait} className="gap-1.5 bg-primary/20 text-primary border-none py-2 px-4">
                        {trait} <X className="w-3 h-3 cursor-pointer" onClick={() => removeTrait(trait)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center py-4">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-[#1DB954]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <MusicIcon className="w-8 h-8 text-[#1DB954]" />
                  </div>
                  <h2 className="text-3xl font-headline font-bold mb-4">Music Profile</h2>
                  
                  {!showManualMusic ? (
                    <div className="space-y-4">
                      {spotifyConnected ? (
                        <div className="glass bg-[#1DB954]/5 border-[#1DB954]/20 p-6 rounded-2xl text-left">
                          <div className="flex items-center gap-3 mb-4">
                            <CheckCircle2 className="w-5 h-5 text-[#1DB954]" />
                            <span className="font-bold text-[#1DB954]">Spotify Connected</span>
                          </div>
                        </div>
                      ) : (
                        <Button onClick={handleConnectSpotify} className="w-full h-14 rounded-2xl bg-[#1DB954] hover:bg-[#1DB954]/90 font-bold gap-3">
                          Connect Spotify
                        </Button>
                      )}
                      
                      {!spotifyConnected && (
                        <Button variant="outline" onClick={() => setShowManualMusic(true)} className="w-full h-14 rounded-2xl glass border-white/10 font-bold">
                          Manual Entry
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6 text-left">
                      <div className="space-y-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Genres</label>
                        <div className="flex gap-2">
                           <Input placeholder="Genre..." value={newGenre} onChange={e => setNewGenre(e.target.value)} className="bg-white/5" onKeyDown={e => e.key === 'Enter' && addManualGenre()} />
                           <Button onClick={addManualGenre} variant="outline" className="shrink-0"><Plus className="w-4 h-4" /></Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.music.genres.map(g => <Badge key={g} variant="outline" className="gap-1.5">{g}</Badge>)}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Artists</label>
                        <div className="flex gap-2">
                           <Input placeholder="Artist..." value={newArtist} onChange={e => setNewArtist(e.target.value)} className="bg-white/5" onKeyDown={e => e.key === 'Enter' && addManualArtist()} />
                           <Button onClick={addManualArtist} variant="outline" className="shrink-0"><Plus className="w-4 h-4" /></Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.music.favoriteArtists.map(a => <Badge key={a} className="gap-1.5 bg-primary/20 text-primary border-none">{a}</Badge>)}
                        </div>
                      </div>
                      <Button variant="ghost" onClick={() => setShowManualMusic(false)} className="w-full text-xs">← Back</Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center">
                <h2 className="text-3xl font-headline font-bold mb-2">Review Profile</h2>
                <div className="flex flex-col items-center gap-4">
                   <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center overflow-hidden border-2 border-primary/20 shadow-2xl">
                    {formData.profileImage ? (
                      <img src={formData.profileImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-10 h-10 text-primary" />
                    )}
                  </div>
                  <h3 className="text-2xl font-headline font-bold">{formData.name || "Explorer"}</h3>
                  <p className="text-muted-foreground text-sm max-w-sm">Ready to finalize your resonance?</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex justify-between gap-4">
            <Button variant="ghost" onClick={prevStep} disabled={step === 0} className="rounded-xl px-8 h-12">Back</Button>
            {step === STEPS.length - 1 ? (
              <Button onClick={handleFinish} className="rounded-xl px-8 h-12 bg-primary shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />} 
                {profile?.onboarded ? "Update Vector" : "Finalize Vector"}
              </Button>
            ) : (
              <Button onClick={nextStep} className="rounded-xl px-8 h-12 bg-primary">
                Continue <ArrowRight className="ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
